import { UsersController } from "../controller/users.controller.js";
import { UsersService } from "../service/users.service.js";
export const usersRoutes = (app) => {
    // User Module Setup
    const usersService = new UsersService();
    const usersController = new UsersController(usersService);
    // User Routes
    app.get("/users", (req, res, next) => usersController.findAll(req, res, next));
    app.get("/users/:id", (req, res, next) => usersController.findById(req, res, next));
    app.delete("/users/:id", (req, res, next) => usersController.delete(req, res, next));
};
