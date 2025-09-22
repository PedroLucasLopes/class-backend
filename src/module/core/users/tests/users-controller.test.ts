// tests/integration/students.controller.spec.ts
import { app } from "../../../../../main";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import request from "supertest";

describe("UsersController Integration", () => {
  const baseUrl = "/api/users";
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.user.deleteMany();

    const signupRes = await request(app)
      .post("/api/signup")
      .send({
        username: "Tester",
        email: "userscontroller@example.com",
        password: "PasswordContr0ll3r",
      })
      .expect(200);

    token = signupRes.body.token;

    // Caso contrário, faça login para obter token
    if (!token) {
      const loginRes = await request(app)
        .post("/api/login")
        .send({
          email: "userscontroller@example.com",
          password: "PasswordContr0ll3r",
        })
        .expect(200);

      token = loginRes.body.token;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /users - should return paginated students", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      limit: expect.any(Number),
      totalItems: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it("GET /users/:id - should return a student by ID", async () => {
    const user = await prisma.user.findFirst({
      where: { email: "userscontroller@example.com" },
    });

    const res = await request(app)
      .get(`${baseUrl}/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: user.id,
      username: "Tester",
    });
  });

  it("DELETE /users/:id - should delete the user", async () => {
    const user = await prisma.user.findFirst({
      where: { email: "userscontroller@example.com" },
    });
    const res = await request(app)
      .delete(`${baseUrl}/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    expect(204);
  });
});
