import { Request, Response, NextFunction } from "express";
import { logger } from "../../../../shared/log/_logger";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import {
  orderEnum,
  PaginatedResponse,
} from "../../../../shared/model/pagination.model";
import { StatusCode } from "../../../../shared/exception/http-exception.exception";
import { ExceptionHandler } from "../../../../shared/utils/exception-handler";
import { NotFoundException } from "../../../../shared/exception/not-found.exception";
import { UsersService } from "../service/users.service";
import { IGetUser } from "../model/getuser.model";

export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.max(Number(req.query.limit) || 10, 1);
      const order = req.query.order as orderEnum;

      logger.info("Fetching all users");
      logger.info("Checking total users");

      const [usersCount, users] = await Promise.all([
        prisma.user.count(),
        this.usersService.findAll(page, limit, order),
      ]);

      const response: PaginatedResponse<IGetUser> = {
        data: users,
        pagination: {
          page,
          limit,
          totalItems: usersCount,
          totalPages: Math.ceil(usersCount / limit),
        },
      };

      return res.status(StatusCode.SUCCESS).json(response);
    } catch (err) {
      logger.error("Error to fetch users data", { error: err });
      console.log(err);
      throw next(ExceptionHandler(err));
    }
  }

  // GET /users/:id
  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      logger.info("Fetching user by ID", { userId: id });
      const user: IGetUser = await this.usersService.findById(id);
      if (user) {
        return res.json(user);
      }
      return next(new NotFoundException("User not found"));
    } catch (err) {
      logger.error("Error to fetch user data by ID", { error: err });
      throw next(ExceptionHandler(err));
    }
  }

  // DELETE /users/:id
  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      logger.info("Deleting user", { userId: id });
      await this.usersService.delete(id);
      return res.status(StatusCode.NO_CONTENT).send();
    } catch (err) {
      logger.error("Error to delete user", { error: err });
      throw next(ExceptionHandler(err));
    }
  }
}
