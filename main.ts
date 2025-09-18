import express from "express";
import { StudentsController } from "./src/module/core/students/controller/students.controller";
import { StudentsService } from "./src/module/core/students/service/students.service";

const app = express();
const port = 3000;

// Student Module Setup
const studentsService = new StudentsService();
const studentsController = new StudentsController(studentsService);

// Student Routes
app.get("/users", (req, res) => studentsController.findAll(req, res));
app.get("/users/:id", (req, res) => studentsController.findById(req, res));
app.post("/users", (req, res) => studentsController.create(req, res));
app.put("/users/:id", (req, res) => studentsController.update(req, res));
app.delete("/users/:id", (req, res) => studentsController.delete(req, res));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
