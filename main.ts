import express from "express";
import { errorMiddleware } from "./src/shared/middleware/error.middleware";
import { studentsRoutes } from "./src/module/core/students/routes/studentsRoutes.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes } from "./src/shared/auth/routes/authRoutes.routes";
import { usersRoutes } from "./src/module/core/users/routes/users.routes";

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Module Routes
studentsRoutes(app);
usersRoutes(app);

// Authentication Routes
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
