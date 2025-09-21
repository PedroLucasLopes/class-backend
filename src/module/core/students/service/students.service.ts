import { NextFunction } from "express";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { normalizeCpf } from "../../../../shared/utils/normalize-cpf.utils";
import { IStudent } from "../model/poststudent.model";
import { IUpdateStudent } from "../model/updatestudent.model";

export class StudentsService {
  async findAll() {
    return prisma.student.findMany();
  }

  async findById(id: string) {
    return prisma.student.findUnique({ where: { id } });
  }

  async findByRa(ra: string) {
    return prisma.student.findUnique({ where: { ra } });
  }

  async create(data: IStudent, next: NextFunction) {
    let { cpf, ...body } = data;
    normalizeCpf(cpf, next);
    return prisma.student.create({ data: { cpf, ...body } });
  }

  async update(id: string, data: IUpdateStudent) {
    return prisma.student.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.student.delete({ where: { id } });
  }
}
