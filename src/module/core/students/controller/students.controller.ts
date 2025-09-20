import { NextFunction, Request, Response } from "express";
import { StudentsService } from "../service/students.service";
import { IGetStudent } from "../model/getstudent.model";
import { IStudent } from "../model/poststudent.model";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { logger } from "../../../../shared/log/_logger";
import { UniqueConstraintError } from "../exception/unique-ra.exception";
import { InternalErrorException } from "../exception/internal-error.exception";

export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  // GET /students
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Fetching all students");
      const students: IGetStudent[] = await this.studentsService.findAll();
      return res.json(students);
    } catch (err) {
      logger.error("Error to fetch students data", { error: err });
      throw next(new InternalErrorException("Internal server error"));
    }
  }

  // GET /students/:id
  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      logger.info("Fetching student by ID", { studentId: id });
      const student: IGetStudent = await this.studentsService.findById(id);
      if (student) {
        return res.json(student);
      }
      return res.status(404).json({ message: "User not found" });
    } catch (err) {
      logger.error("Error to fetch student data by ID", { error: err });
      throw next(new InternalErrorException("Internal server error"));
    }
  }

  // GET /students/ra/:ra
  async findByRa(req: Request, res: Response, next: NextFunction) {
    const { ra } = req.params;
    try {
      logger.info("Fetching student by RA", { studentRa: ra });
      const student: IGetStudent = await this.studentsService.findByRa(ra);
      if (student) {
        return res.status(200).json(student);
      }
      return res.status(404).json({ message: "User not found" });
    } catch (err) {
      logger.error("Error to fetch student data by RA", { error: err });
      throw next(new InternalErrorException("Internal server error"));
    }
  }

  // POST /students
  async create(req: Request, res: Response, next: NextFunction) {
    const data: IStudent = req.body;
    try {
      logger.info("Creating a new student", { student: data });
      const newUser: IStudent = await this.studentsService.create(data);

      return res.status(201).json(newUser);
    } catch (err) {
      logger.error("Error to create a new student", { error: err });
      if (err instanceof PrismaClientKnownRequestError) {
        throw next(new UniqueConstraintError("RA is already in use"));
      }
      throw next(new InternalErrorException("Internal server error"));
    }
  }

  // PUT /students/:id
  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data: IGetStudent = req.body;
    try {
      logger.info("Updating student data", { studentId: id, updateData: data });
      const updatedUser = await this.studentsService.update(id, { ...data });
      return res.json(updatedUser);
    } catch (err) {
      logger.error("Error to update student data", { error: err });
      throw next(new InternalErrorException("Internal server error"));
    }
  }

  // DELETE /students/:id
  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      logger.info("Deleting student", { studentId: id });
      await this.studentsService.delete(id);
      return res.status(204).send();
    } catch (err) {
      logger.error("Error to delete student", { error: err });
      throw next(new InternalErrorException("Internal server error"));
    }
  }
}
