import request from "supertest";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { app } from "../../../../../main";
import { orderEnum } from "../../../../shared/model/pagination.model";
import { UsersService } from "../service/users.service";

const service = new UsersService();

let token: string;

describe("usersService Integration", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.user.deleteMany();

    const signupRes = await request(app)
      .post("/api/signup")
      .send({
        username: "Tester",
        email: "usersservice@example.com",
        password: "PasswordControll3r",
      })
      .expect(200);

    token = signupRes.body.token;

    if (!token) {
      const loginRes = await request(app)
        .post("/api/login")
        .send({
          email: "usersservice@example.com",
          password: "PasswordControll3r",
        })
        .expect(200);
      token = loginRes.body.token;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("findAll", () => {
    it("should list users with pagination", async () => {
      const users = await service.findAll(1, 10, "desc" as orderEnum);
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const userId = await prisma.user.findFirst({
        where: { email: "usersservice@example.com" },
      });
      const user = await service.findById(userId.id);
      expect(user?.id).toBe(user.id);
    });
  });

  describe("delete", () => {
    it("should delete user by id", async () => {
      const user = await prisma.user.findFirst({
        where: { email: "usersservice@example.com" },
      });
      const deleted = await service.delete(user.id);
      expect(deleted.id).toBe(user.id);

      const found = await service.findById(user.id);
      expect(found).toBeNull();
    });
  });
});
