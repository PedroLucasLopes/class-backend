import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module.js";
export class UsersService {
    async findAll(page, limit, orderBy) {
        const paginationRegister = Number(limit) || 10;
        const paginationInterval = ((Number(page) || 1) - 1) * (Number(limit) || 10);
        return prisma.user.findMany({
            take: paginationRegister,
            skip: paginationInterval,
            orderBy: { createdAt: orderBy || "desc" },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    async delete(id) {
        return prisma.user.delete({ where: { id } });
    }
}
