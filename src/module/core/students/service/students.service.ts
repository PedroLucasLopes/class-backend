import { NextFunction } from "express";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module.js";
import { normalizeCpf } from "../../../../shared/utils/normalize-cpf.utils.js";
import { IStudent } from "../model/poststudent.model.js";
import { IUpdateStudent } from "../model/updatestudent.model.js";
import { orderEnum } from "../../../../shared/model/pagination.model.js";
import { normalizeEmail } from "../../../../shared/utils/normalize-email.utils.js";

export class StudentsService {
  async findAll(page?: number, limit?: number, orderBy?: orderEnum) {
    const paginationRegister = Number(limit) || 10;
    const paginationInterval =
      ((Number(page) || 1) - 1) * (Number(limit) || 10);
    return prisma.student.findMany({
      take: paginationRegister,
      skip: paginationInterval,
      orderBy: { createdAt: orderBy || "desc" },
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
