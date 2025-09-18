import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { IStudent } from "../model/poststudent.model";

export class StudentsService {
  async findAll() {
    return prisma.student.findMany();
  }

  async findById(id: string) {
    return prisma.student.findUnique({ where: { id } });
  }

  async create(data: IStudent) {
    return prisma.student.create({ data });
  }

  async update(id: string, data: IStudent) {
    return prisma.student.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.student.delete({ where: { id } });
  }
}
