import { NextFunction } from "express";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module.js";
import { orderEnum } from "../../../../shared/model/pagination.model.js";
import { IUser } from "../model/postuser.model.js";
import { IUpdateUser } from "../model/updateuser.model.js";

export class UsersService {
  async findAll(page?: number, limit?: number, orderBy?: orderEnum) {
    const paginationRegister = Number(limit) || 10;
    const paginationInterval =
      ((Number(page) || 1) - 1) * (Number(limit) || 10);
    return prisma.user.findMany({
      take: paginationRegister,
      skip: paginationInterval,
      orderBy: { createdAt: orderBy || "desc" },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
