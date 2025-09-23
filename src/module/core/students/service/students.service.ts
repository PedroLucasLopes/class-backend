import { NextFunction } from "express";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { normalizeCpf } from "../../../../shared/utils/normalize-cpf.utils";
import { IStudent } from "../model/poststudent.model";
import { IUpdateStudent } from "../model/updatestudent.model";
import { orderEnum } from "../../../../shared/model/pagination.model";
import { normalizeEmail } from "../../../../shared/utils/normalize-email.utils";
import { Prisma } from "@prisma/client";
import { logger } from "../../../../shared/log/_logger";

export class StudentsService {
  async findAll(
    page?: number,
    limit?: number,
    orderBy?: orderEnum,
    search?: string
  ) {
    const where: Prisma.StudentWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { ra: { contains: search, mode: "insensitive" } },
            { cpf: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const paginationRegister = Number(limit) || 10;
    const paginationInterval = (Number(page) || 1 - 1) * (Number(limit) || 10);
    return prisma.student.findMany({
      take: paginationRegister,
      skip: paginationInterval,
      orderBy: { createdAt: orderBy || "desc" },
      where,
    });
  }

  async findById(id: string) {
    return prisma.student.findUnique({ where: { id } });
  }

  async findByRa(ra: string) {
    return prisma.student.findUnique({ where: { ra } });
  }

  async create(data: IStudent, next: NextFunction) {
    const { cpf, email, ...rest } = data;
    normalizeCpf(cpf, next);
    normalizeEmail(email, next);
    return prisma.student.create({ data: { cpf, email, ...rest } });
  }

  async update(id: string, data: IUpdateStudent) {
    return prisma.student.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.student.delete({ where: { id } });
  }
}
