import { requireAuth } from "../../../../shared/middleware/auth.middleware";
import { UsersController } from "../controller/users.controller";
import { UsersService } from "../service/users.service";

export const usersRoutes = (app) => {
  // User Module Setup
  const usersService = new UsersService();
  const usersController = new UsersController(usersService);

  // User Routes
  /**
   * @openapi
   * /users:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get all users
   *     description: Returns a list of all users in the database. Requires Bearer token authentication.
   *     security:
   *       - bearerAuth: []     # usa o esquema global de segurança JWT
   *     responses:
   *       200:
   *         description: Successful response with a list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "b1a2c3d4"
   *                   name:
   *                     type: string
   *                     example: "Jane Doe"
   *                   email:
   *                     type: string
   *                     format: email
   *                     example: "jane@example.com"
   *       401:
   *         description: Unauthorized – missing or invalid token
   */
  app.get("/users", requireAuth, (req, res, next) =>
    usersController.findAll(req, res, next)
  );
  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get a user by ID
   *     description: Returns a single user by their unique identifier. Requires Bearer token authentication.
   *     security:
   *       - bearerAuth: []       # usa o esquema de segurança JWT já definido
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to retrieve
   *     responses:
   *       200:
   *         description: Successful response with the user data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "a1b2c3d4"
   *                 name:
   *                   type: string
   *                   example: "Jane Doe"
   *                 email:
   *                   type: string
   *                   format: email
   *                   example: "jane@example.com"
   *       401:
   *         description: Unauthorized – missing or invalid token
   *       404:
   *         description: User not found
   */
  app.get("/users/:id", requireAuth, (req, res, next) =>
    usersController.findById(req, res, next)
  );
  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     tags:
   *       - Users
   *     summary: Delete a user
   *     description: Remove a user from the database by their ID. Requires Bearer token authentication.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to delete
   *     responses:
   *       204:
   *         description: User deleted successfully (no content)
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized – missing or invalid token
   *       404:
   *         description: User not found
   */
  app.delete("/users/:id", requireAuth, (req, res, next) =>
    usersController.delete(req, res, next)
  );
};
