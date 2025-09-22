import { Request, Response, NextFunction } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { requireAuth } from "../../middleware/auth.middleware";
import { StatusCode } from "../../exception/http-exception.exception";

export const authRoutes = (app) => {
  // Auth Shared Setup
  const authService = new AuthService();
  const authController = new AuthController(authService);

  // Authenticate Routes
  app.post("/login", (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
  );
  app.post("/signup", (req: Request, res: Response, next: NextFunction) =>
    authController.signUp(req, res, next)
  );
  app.post("/logout", (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req, res, next)
  );
  app.put(
    "/forgot-password",
    (req: Request, res: Response, next: NextFunction) =>
      authController.forgotPassword(req, res, next)
  );
  app.put(
    "/reset-password",
    (req: Request, res: Response, next: NextFunction) =>
      authController.resetPassword(req, res, next)
  );
  app.put("/refresh-token", (req: Request, res: Response, next: NextFunction) =>
    authController.refreshToken(req, res, next)
  );

  app.get("/protected", requireAuth, (req, res) => {
    res
      .status(StatusCode.SUCCESS)
      .json({ message: "You're authenticated as user" });
  });
};
