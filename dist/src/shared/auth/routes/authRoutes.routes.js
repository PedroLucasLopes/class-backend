import { AuthController } from "../controller/auth.controller.js";
import { AuthService } from "../service/auth.service.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { StatusCode } from "../../exception/http-exception.exception.js";
export const authRoutes = (app) => {
    // Auth Shared Setup
    const authService = new AuthService();
    const authController = new AuthController(authService);
    // Authenticate Routes
    app.post("/login", (req, res, next) => authController.login(req, res, next));
    app.post("/signup", (req, res, next) => authController.signUp(req, res, next));
    app.post("/logout", (req, res, next) => authController.logout(req, res, next));
    app.put("/forgot-password", (req, res, next) => authController.forgotPassword(req, res, next));
    app.put("/reset-password", (req, res, next) => authController.resetPassword(req, res, next));
    app.put("/refresh-token", (req, res, next) => authController.refreshToken(req, res, next));
    app.get("/protected", requireAuth, (req, res) => {
        res
            .status(StatusCode.SUCCESS)
            .json({ message: "You're authenticated as user" });
    });
};
