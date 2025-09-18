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

  // GET /users/:id
  async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.studentsService.findById(id);
      if (user) {
        return res.json(user);
      }
      return res.status(404).json({ message: "User not found" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /users
  async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const newUser = await this.studentsService.create(data);
      return res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /users/:id
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedUser = await this.studentsService.update(id, data);
      return res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /users/:id
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.studentsService.delete(id);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
