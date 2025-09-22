import express from "express";
import { errorMiddleware } from "./src/shared/middleware/error.middleware";
import { studentsRoutes } from "./src/module/core/students/routes/students.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes } from "./src/shared/auth/routes/auth.routes";
import { usersRoutes } from "./src/module/core/users/routes/users.routes";
import dotenv from "dotenv";
import swaggerDocs from "./swagger";

dotenv.config();

export const app = express();
const router = express.Router();
const port = 8080;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Module Routes
studentsRoutes(router);
usersRoutes(router);

// Authentication Routes
authRoutes(router);

app.use("/api", router);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  swaggerDocs(app, port);
});
