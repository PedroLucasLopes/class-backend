import { prisma } from "../../persistence/prisma/prisma-persistence.module";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../../utils/token.utils";
import { comparePassword, hashPassword } from "../../utils/hash.utils";
import { logger } from "../../log/_logger";
import { NextFunction } from "express";
import { UnauthorizedException } from "../../exception/unauthorized.exception";
import { verifyRefreshToken } from "../../utils/token.utils";
import { BadRequestException } from "../../exception/bad-request.exception";
import { normalizeEmail } from "../../utils/normalize-email.utils";

export class AuthService {
  async signUp(
    username: string,
    email: string,
    password: string,
    next: NextFunction
  ) {
    logger.info("Creating new user in the database", { username, email });
    const hashed = await hashPassword(password);
    normalizeEmail(email, next);
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    logger.info("User created successfully", { userId: user.id });

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    logger.info("Generated access and refresh tokens", {
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string, next: NextFunction) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw next(new UnauthorizedException("Invalid email or password"));
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw next(new UnauthorizedException("The password is incorrect"));
    }

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const { token, expiry } = await generateResetToken();

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExp: expiry },
    });

    return { token };
  }

  async resetPassword(token: string, newPassword: string, next: NextFunction) {
    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });
    if (!user)
      throw next(new BadRequestException("Invalid or expired reset token"));

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });
  }
}
