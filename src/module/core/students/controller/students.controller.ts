import { NextFunction, Request, Response } from "express";
import { StudentsService } from "../service/students.service";
import { IGetStudent } from "../model/getstudent.model";
import { IStudent } from "../model/poststudent.model";
import { logger } from "../../../../shared/log/_logger";
import { ExceptionHandler } from "../utils/exception-handler";
import { IUpdateStudent } from "../model/updatestudent.model";
import { BadRequestException } from "../exception/bad-request.exception";
import { NotFoundException } from "../exception/not-found.exception";

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
      console.log(err);
      throw next(ExceptionHandler(err));
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
      return next(new NotFoundException("User not found"));
    } catch (err) {
      logger.error("Error to fetch student data by ID", { error: err });
      throw next(ExceptionHandler(err));
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
      return next(new NotFoundException("User not found"));
    } catch (err) {
      logger.error("Error to fetch student data by RA", { error: err });
      throw next(ExceptionHandler(err));
    }
  }

  // POST /students
  async create(req: Request, res: Response, next: NextFunction) {
    const data: IStudent = req.body;
    try {
      logger.info("Creating a new student", { student: data });
      const newUser: IStudent = await this.studentsService.create(data, next);
      return res.status(201).json(newUser);
    } catch (err) {
      logger.error("Error to create a new student", { error: err });
      throw next(ExceptionHandler(err));
    }
  }

  // PUT /students/:id
  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data: IGetStudent = req.body;
    try {
      const { ra, cpf, ...updatableData } = data;
      logger.info("Updating student data", { studentId: id, updateData: data });
      if (req.body.ra || req.body.cpf) {
        return next(
          new BadRequestException("RA and CPF fields cannot be updated")
        );
      }
      const updatedUser = await this.studentsService.update(id, updatableData);
      return res.json(updatedUser);
    } catch (err) {
      logger.error("Error to update student data", { error: err });
      throw next(ExceptionHandler(err));
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
      throw next(ExceptionHandler(err));
    }
  }
}
