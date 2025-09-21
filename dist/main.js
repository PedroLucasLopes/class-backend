import express from "express";
import { errorMiddleware } from "./src/shared/middleware/error.middleware.js";
import { studentsRoutes } from "./src/module/core/students/routes/studentsRoutes.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes } from "./src/shared/auth/routes/authRoutes.routes.js";
import { usersRoutes } from "./src/module/core/users/routes/users.routes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const router = express.Router();
const port = 3000;
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
});
