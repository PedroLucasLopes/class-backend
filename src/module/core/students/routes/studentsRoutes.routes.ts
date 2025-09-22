import { requireAuth } from "../../../../shared/middleware/auth.middleware.js";
import { StudentsController } from "../controller/students.controller.js";
import { StudentsService } from "../service/students.service.js";

export const studentsRoutes = (app) => {
  // Student Module Setup
  const studentsService = new StudentsService();
  const studentsController = new StudentsController(studentsService);

  // Student Routes
  app.get("/students", requireAuth, (req, res, next) =>
    studentsController.findAll(req, res, next)
  );
  app.get("/students/:id", requireAuth, (req, res, next) =>
    studentsController.findById(req, res, next)
  );
  app.get("/students/ra/:ra", requireAuth, (req, res, next) =>
    studentsController.findByRa(req, res, next)
  );
  app.post("/students", requireAuth, (req, res, next) =>
    studentsController.create(req, res, next)
  );
  app.put("/students/:id", requireAuth, (req, res, next) =>
    studentsController.update(req, res, next)
  );
  app.delete("/students/:id", requireAuth, (req, res, next) =>
    studentsController.delete(req, res, next)
  );
};
