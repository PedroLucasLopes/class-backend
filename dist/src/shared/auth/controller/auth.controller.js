import { ExceptionHandler } from "../../utils/exception-handler.js";
import { StatusCode } from "../../exception/http-exception.exception.js";
import { logger } from "../../log/_logger.js";
import { BadRequestException } from "../../exception/bad-request.exception.js";
export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // POST /api/auth/login
    async login(req, res, next) {
        try {
            logger.info("Logging in user");
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.authService.login(email, password, next);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return res.status(StatusCode.SUCCESS).json({ token: accessToken });
        }
        catch (err) {
            logger.error("Error during user login", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // POST /api/auth/logout
    async logout(req, res, next) {
        try {
            logger.info("Logging out user");
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            return res
                .status(StatusCode.SUCCESS)
                .json({ message: "Logged out successfully" });
        }
        catch (err) {
            logger.error("Error during user logout", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // POST /api/auth/signup
    async signUp(req, res, next) {
        try {
            logger.info("Signing up new user", { body: req.body });
            const { username, email, password } = req.body;
            const { accessToken, refreshToken } = await this.authService.signUp(username, email, password);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return res.status(StatusCode.SUCCESS).json({ token: accessToken });
        }
        catch (err) {
            logger.error("Error during user signup", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // POST /api/auth/forgot-password
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            logger.info("Processing forgot password request", { email });
            const { token } = await this.authService.forgotPassword(email);
            logger.info("Forgot password process completed", { email, token });
            res.status(StatusCode.SUCCESS).json({
                message: `An email has been sent to ${email} with further instructions.`,
            });
        }
        catch (err) {
            logger.error("Error during forgot password process", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            logger.info("Processing password reset request", { token });
            await this.authService.resetPassword(token, newPassword, next);
            res
                .status(StatusCode.SUCCESS)
                .json({ message: "Password has been reset successfully." });
        }
        catch (err) {
            logger.error("Error during password reset process", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // POST /api/auth/refresh-token
    async refreshToken(req, res, next) {
        try {
            const token = req.cookies.refreshToken;
            logger.info("Verifying refresh token", { token });
            if (!token) {
                return next(new BadRequestException("No token provided"));
            }
            const { accessToken, refreshToken } = await this.authService.refreshToken(token);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return res.status(StatusCode.SUCCESS).json({ token: accessToken });
        }
        catch (err) {
            logger.error("Error verifying refresh token", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
}
