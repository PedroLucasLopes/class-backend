import { logger } from "../../../../shared/log/_logger.js";
import { ExceptionHandler } from "../../../../shared/utils/exception-handler.js";
import { BadRequestException } from "../../../../shared/exception/bad-request.exception.js";
import { NotFoundException } from "../../../../shared/exception/not-found.exception.js";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module.js";
import { StatusCode } from "../../../../shared/exception/http-exception.exception.js";
export class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    // GET /students
    async findAll(req, res, next) {
        try {
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 10, 1);
            const order = req.query.order;
            logger.info("Fetching all students");
            logger.info("Checking total students");
            const [studentsCount, students] = await Promise.all([
                prisma.student.count(),
                this.studentsService.findAll(page - 1, limit, order),
            ]);
            if (!students.length) {
                return next(new NotFoundException("No students found"));
            }
            const response = {
                data: students,
                pagination: {
                    page,
                    limit,
                    totalItems: studentsCount,
                    totalPages: Math.ceil(studentsCount / limit),
                },
            };
            return res.status(StatusCode.SUCCESS).json(response);
        }
        catch (err) {
            logger.error("Error to fetch students data", { error: err });
            console.log(err);
            throw next(ExceptionHandler(err));
        }
    }
    // GET /students/:id
    async findById(req, res, next) {
        const { id } = req.params;
        try {
            logger.info("Fetching student by ID", { studentId: id });
            const student = await this.studentsService.findById(id);
            if (student) {
                return res.json(student);
            }
            return next(new NotFoundException("User not found"));
        }
        catch (err) {
            logger.error("Error to fetch student data by ID", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // GET /students/ra/:ra
    async findByRa(req, res, next) {
        const { ra } = req.params;
        try {
            logger.info("Fetching student by RA", { studentRa: ra });
            const student = await this.studentsService.findByRa(ra);
            if (student) {
                return res.status(StatusCode.SUCCESS).json(student);
            }
            return next(new NotFoundException("User not found"));
        }
        catch (err) {
            logger.error("Error to fetch student data by RA", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // POST /students
    async create(req, res, next) {
        const data = req.body;
        try {
            logger.info("Creating a new student", { student: data });
            const newUser = await this.studentsService.create(data, next);
            return res.status(StatusCode.CREATED).json(newUser);
        }
        catch (err) {
            logger.error("Error to create a new student", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // PUT /students/:id
    async update(req, res, next) {
        const { id } = req.params;
        const data = req.body;
        try {
            const { ra, cpf, ...updatableData } = data;
            logger.info("Updating student data", { studentId: id, updateData: data });
            if (req.body.ra || req.body.cpf) {
                return next(new BadRequestException("RA and CPF fields cannot be updated"));
            }
            const updatedUser = await this.studentsService.update(id, updatableData);
            return res.json(updatedUser);
        }
        catch (err) {
            logger.error("Error to update student data", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
    // DELETE /students/:id
    async delete(req, res, next) {
        const { id } = req.params;
        try {
            logger.info("Deleting student", { studentId: id });
            await this.studentsService.delete(id);
            return res.status(StatusCode.NO_CONTENT).send();
        }
        catch (err) {
            logger.error("Error to delete student", { error: err });
            throw next(ExceptionHandler(err));
        }
    }
}
