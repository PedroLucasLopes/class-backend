import { NextFunction } from "express";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { normalizeCpf } from "../../../../shared/utils/normalize-cpf.utils";
import { IStudent } from "../model/poststudent.model";
import { IUpdateStudent } from "../model/updatestudent.model";
import { orderEnum } from "../model/pagination.model";

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
    const { cpf, ...rest } = data;
    normalizeCpf(cpf, next);
    return prisma.student.create({ data: { cpf, ...rest } });
  }

  async update(id: string, data: IUpdateStudent) {
    return prisma.student.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.student.delete({ where: { id } });
  }
}
