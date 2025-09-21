import { AuthController } from "../controller/auth.controller";

export const authRoutes = (app) => {
  // Auth Shared Setup
  const authController = new AuthController();

  // Authenticate Routes
  app.post("/login", (req, res, next) => authController.login());
  app.post("/signup", (req, res, next) => authController.signUp());
  app.post("/forgot-password", (req, res, next) =>
    authController.forgotPassword()
  );
  app.post("/logout", (req, res, next) => authController.logout());
  app.post("/refresh-token", (req, res, next) => authController.refreshToken());
};
