import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module.js";
import { normalizeCpf } from "../../../../shared/utils/normalize-cpf.utils.js";
export class StudentsService {
    async findAll(page, limit, orderBy) {
        const paginationRegister = Number(limit) || 10;
        const paginationInterval = ((Number(page) || 1) - 1) * (Number(limit) || 10);
        return prisma.student.findMany({
            take: paginationRegister,
            skip: paginationInterval,
            orderBy: { createdAt: orderBy || "desc" },
        });
    }
    async findById(id) {
        return prisma.student.findUnique({ where: { id } });
    }
    async findByRa(ra) {
        return prisma.student.findUnique({ where: { ra } });
    }
    async create(data, next) {
        const { cpf, ...rest } = data;
        normalizeCpf(cpf, next);
        return prisma.student.create({ data: { cpf, ...rest } });
    }
    async update(id, data) {
        return prisma.student.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma.student.delete({ where: { id } });
    }
}
