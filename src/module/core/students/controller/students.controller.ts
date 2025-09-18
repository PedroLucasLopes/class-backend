import { Request, Response } from "express";
import { StudentsService } from "../service/students.service";
import { IGetStudent } from "../model/getstudent.model";

export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  // GET /users
  async findAll(req: Request, res: Response) {
    try {
      const users: IGetStudent[] = await this.studentsService.findAll();
      return res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
