import express from "express";
import { errorMiddleware } from "./src/shared/middleware/error.middleware";
import { studentsRoutes } from "./src/module/core/students/routes/studentsRoutes.routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Module Routes
studentsRoutes(app);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
