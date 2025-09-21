import { NextFunction } from "express";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { orderEnum } from "../../../../shared/model/pagination.model";
import { IUser } from "../model/postuser.model";
import { IUpdateUser } from "../model/updateuser.model";

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

  async create(data: IUser) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: IUpdateUser) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
