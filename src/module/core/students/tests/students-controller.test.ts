// tests/integration/students.controller.spec.ts
import { app } from "../../../../../main";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import request from "supertest";

describe("StudentsController Integration", () => {
  let studentId: string;
  const baseUrl = "/api/students";
  let token: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.student.deleteMany();

    const signupRes = await request(app)
      .post("/api/signup")
      .send({
        username: "Tester",
        email: "studentscontroller@example.com",
        password: "PasswordContr0ller",
      })
      .expect(200);

    token = signupRes.body.token;

    // Caso contrário, faça login para obter token
    if (!token) {
      const loginRes = await request(app)
        .post("/api/login")
        .send({
          email: "studentscontroller@example.com",
          password: "PasswordContr0ller",
        })
        .expect(200);

      token = loginRes.body.token;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /students - should create a new student", async () => {
    const newStudent = {
      name: "John Doe",
      ra: "RA9876543210",
      cpf: "03461242632",
      email: "john@example.com",
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send(newStudent)
      .expect(201);

    expect(res.body).toMatchObject({
      name: "John Doe",
      ra: "RA9876543210",
      cpf: "03461242632",
      email: "john@example.com",
    });
    expect(res.body.id).toBeDefined();
    studentId = res.body.id;
  });

  it("GET /students - should return paginated students", async () => {
    // garante ao menos um estudante
    const student = await prisma.student.create({
      data: {
        name: "Jane Doe",
        ra: "654321",
        cpf: "99988877766",
        email: "jane@example.com",
      },
    });

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

  it("GET /students/:id - should return a student by ID", async () => {
    const student = await prisma.student.create({
      data: {
        name: "Mark Test",
        ra: "111111",
        cpf: "22233344455",
        email: "mark@example.com",
      },
    });

    const res = await request(app)
      .get(`${baseUrl}/${student.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: student.id,
      name: "Mark Test",
    });
  });

  it("GET /students/ra/:ra - should return a student by RA", async () => {
    const student = await prisma.student.create({
      data: {
        name: "RA Test",
        ra: "777777",
        cpf: "12312312312",
        email: "ra@test.com",
      },
    });

    const res = await request(app)
      .get(`${baseUrl}/ra/${student.ra}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      ra: student.ra,
      name: "RA Test",
    });
  });

  it("PUT /students/:id - should update a student (excluding RA/CPF)", async () => {
    const student = await prisma.student.create({
      data: {
        name: "Update Me!",
        ra: "uniqueRA12345",
        cpf: "02163422607",
        email: "update@update.com",
      },
    });

    const res = await request(app)
      .put(`${baseUrl}/${student.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Name" })
      .expect(200);

    expect(res.body).toMatchObject({
      id: student.id,
      name: "Updated Name",
    });
  });

  it("PUT /students/:id - should reject updates to RA or CPF", async () => {
    const student = await prisma.student.create({
      data: {
        name: "Invalid Update",
        ra: "333444",
        cpf: "44455566677",
        email: "invalid@update.com",
      },
    });

    const res = await request(app)
      .put(`${baseUrl}/${student.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ra: "newRA" })
      .expect(400);

    expect(res.body.message).toMatch(/RA and CPF fields cannot be updated/i);
  });

  it("DELETE /students/:id - should delete a student", async () => {
    const student = await prisma.student.create({
      data: {
        name: "John Doe",
        ra: "validRA223344",
        cpf: "02431097684",
        email: "john@example.com",
      },
    });

    await request(app)
      .delete(`${baseUrl}/${student.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const exists = await prisma.student.findUnique({
      where: { id: student.id },
    });
    expect(exists).toBeNull();
  });

  it("GET /students/:id - should return 404 for missing student", async () => {
    const res = await request(app)
      .get(`${baseUrl}/non-existing-id`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(res.body.message).toMatch(/User not found/i);
  });
});
