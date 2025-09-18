import express from "express";
import { StudentsController } from "./src/module/core/students/controller/students.controller";
import { StudentsService } from "./src/module/core/students/service/students.service";

const app = express();
const port = 3000;

const studentsService = new StudentsService();
const studentsController = new StudentsController(studentsService);

app.get("/users", (req, res) => studentsController.findAll(req, res));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
