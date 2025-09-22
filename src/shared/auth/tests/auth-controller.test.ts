import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { BadRequestException } from "../../exception/bad-request.exception";
import { StatusCode } from "../../exception/http-exception.exception";

// Mocks
jest.mock("../service/auth.service");
jest.mock("../../utils/exception-handler.ts", () => ({
  ExceptionHandler: jest.fn((e) => e),
}));
jest.mock("../../log/_logger.ts", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AuthController", () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    authService = new AuthService() as jest.Mocked<AuthService>;
    controller = new AuthController(authService);

    req = {
      body: {},
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    next = jest.fn();
  });

  describe("login", () => {
    it("should login and set cookie", async () => {
      authService.login.mockResolvedValue({
        accessToken: "access",
        refreshToken: "refresh",
      });
      req.body = { email: "user@test.com", password: "123" };

      await controller.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith(
        "user@test.com",
        "123",
        next
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "refresh",
        expect.objectContaining({ httpOnly: true })
      );
      expect(res.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({ token: "access" });
    });
  });

  describe("logout", () => {
    it("should clear cookie and respond", async () => {
      await controller.logout(req, res, next);
      expect(res.clearCookie).toHaveBeenCalledWith(
        "refreshToken",
        expect.objectContaining({ httpOnly: true })
      );
      expect(res.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      });
    });
  });

  describe("signUp", () => {
    it("should sign up and set cookie", async () => {
      authService.signUp.mockResolvedValue({
        accessToken: "aToken",
        refreshToken: "rToken",
      });
      req.body = { username: "Tester", email: "t@t.com", password: "123" };

      await controller.signUp(req, res, next);

      expect(authService.signUp).toHaveBeenCalledWith(
        "Tester",
        "t@t.com",
        "123",
        next
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "rToken",
        expect.objectContaining({ httpOnly: true })
      );
      expect(res.json).toHaveBeenCalledWith({ token: "aToken" });
    });
  });

  describe("forgotPassword", () => {
    it("should send forgot password email", async () => {
      authService.forgotPassword.mockResolvedValue({ token: "reset-token" });
      req.body = { email: "x@x.com" };

      await controller.forgotPassword(req, res, next);

      expect(authService.forgotPassword).toHaveBeenCalledWith("x@x.com");
      expect(res.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining("x@x.com"),
      });
    });
  });

  describe("resetPassword", () => {
    it("should reset password", async () => {
      authService.resetPassword.mockResolvedValue(undefined);
      req.body = { token: "tkn", newPassword: "newPass" };

      await controller.resetPassword(req, res, next);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        "tkn",
        "newPass",
        next
      );
      expect(res.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password has been reset successfully.",
      });
    });
  });

  describe("refreshToken", () => {
    it("should refresh token if cookie exists", async () => {
      authService.refreshToken.mockResolvedValue({
        accessToken: "a",
        refreshToken: "r",
      });
      req.cookies.refreshToken = "oldRefresh";

      await controller.refreshToken(req, res, next);

      expect(authService.refreshToken).toHaveBeenCalledWith("oldRefresh");
      expect(res.cookie).toHaveBeenCalledWith(
        "refreshToken",
        "r",
        expect.objectContaining({ httpOnly: true })
      );
      expect(res.json).toHaveBeenCalledWith({ token: "a" });
    });

    it("should call next with BadRequest if no token", async () => {
      await controller.refreshToken(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestException));
    });
  });
});
