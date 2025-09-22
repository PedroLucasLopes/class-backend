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
  /**
   * @openapi
   * /login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User login
   *     description: Authenticate a user and return a JWT token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "yourpassword123"
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Successful login with JWT token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         description: Bad request – missing fields
   *       401:
   *         description: Unauthorized – invalid email or password
   */
  app.post("/login", (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next)
  );

  /**
   * @openapi
   * /signup:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User signup
   *     description: Create a new user account and return a JWT token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "john@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "yourpassword123"
   *             required:
   *               - name
   *               - email
   *               - password
   *     responses:
   *       201:
   *         description: User created successfully with JWT token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         description: Bad request – missing fields or invalid input
   *       409:
   *         description: Conflict – user with this email already exists
   */
  app.post("/signup", (req: Request, res: Response, next: NextFunction) =>
    authController.signUp(req, res, next)
  );

  /**
   * @openapi
   * /logout:
   *   post:
   *     tags:
   *       - Auth
   *     summary: User logout
   *     description: Invalidate the user's current JWT token. Requires Bearer token authentication.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *       401:
   *         description: Unauthorized – missing or invalid token
   */
  app.post("/logout", (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req, res, next)
  );

  /**
   * @openapi
   * /forgot-password:
   *   put:
   *     tags:
   *       - Auth
   *     summary: Request password reset
   *     description: Sends a password reset token to the user's email.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *             required:
   *               - email
   *     responses:
   *       200:
   *         description: Password reset token sent successfully
   *       400:
   *         description: Bad request – missing or invalid email
   *       404:
   *         description: Email not found
   */
  app.put(
    "/forgot-password",
    (req: Request, res: Response, next: NextFunction) =>
      authController.forgotPassword(req, res, next)
  );

  /**
   * @openapi
   * /reset-password:
   *   put:
   *     tags:
   *       - Auth
   *     summary: Reset user password
   *     description: Resets the user's password using a valid reset token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token:
   *                 type: string
   *                 description: Password reset token sent via email
   *                 example: "a1b2c3d4e5f6"
   *               newPassword:
   *                 type: string
   *                 format: password
   *                 description: The new password to set
   *                 example: "newStrongPassword123"
   *             required:
   *               - token
   *               - newPassword
   *     responses:
   *       200:
   *         description: Password reset successfully
   *       400:
   *         description: Bad request – invalid or expired token, or invalid password
   *       404:
   *         description: Token not found
   */
  app.put(
    "/reset-password",
    (req: Request, res: Response, next: NextFunction) =>
      authController.resetPassword(req, res, next)
  );

  /**
   * @openapi
   * /refresh-token:
   *   put:
   *     tags:
   *       - Auth
   *     summary: Refresh JWT token
   *     description: Refreshes the user's JWT token using a valid refresh token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: The refresh token previously issued
   *                 example: "dGhpc2lzYXJlZnJlc2h0b2tlbg=="
   *             required:
   *               - refreshToken
   *     responses:
   *       200:
   *         description: New JWT token issued successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         description: Bad request – missing or invalid refresh token
   *       401:
   *         description: Unauthorized – refresh token expired or invalid
   */
  app.put("/refresh-token", (req: Request, res: Response, next: NextFunction) =>
    authController.refreshToken(req, res, next)
  );

  /**
   * @openapi
   * /protected:
   *   get:
   *     tags:
   *       - Auth
   *     summary: Protected route
   *     description: Example route that requires authentication. Returns a success message if the user is logged in.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User is authenticated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "You're authenticated as user"
   *       401:
   *         description: Unauthorized – missing or invalid token
   */
  app.get("/protected", requireAuth, (req, res) => {
    res
      .status(StatusCode.SUCCESS)
      .json({ message: "You're authenticated as user" });
  });
};
