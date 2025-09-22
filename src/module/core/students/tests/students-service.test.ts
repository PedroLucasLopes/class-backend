import request from "supertest";
import { prisma } from "../../../../shared/persistence/prisma/prisma-persistence.module";
import { StudentsService } from "../service/students.service";
import { app } from "../../../../../main";
import { orderEnum } from "../../../../shared/model/pagination.model";
import { IStudent } from "../model/poststudent.model";

const service = new StudentsService();

let token: string;
let studentId: string;

describe("StudentsService Integration", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.student.deleteMany();

    const signupRes = await request(app)
      .post("/api/signup")
      .send({
        username: "Tester",
        email: "studentsservicec@example.com",
        password: "PasswordS3rvice",
      })
      .expect(200);

    token = signupRes.body.token;

    if (!token) {
      const loginRes = await request(app)
        .post("/api/login")
        .send({
          email: "studentsservicec@example.com",
          password: "PasswordS3rvice",
        })
        .expect(200);
      token = loginRes.body.token;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("create", () => {
    it("should create a new student", async () => {
      const newStudent = {
        name: "John Doe",
        ra: "RA123456789",
        cpf: "02431097684",
        email: "john@example.com",
      };

      const student = await service.create(newStudent as IStudent, jest.fn());
      expect(student).toHaveProperty("id");
      expect(student.name).toBe("John Doe");
      studentId = student.id;
    });
  });

  describe("findAll", () => {
    it("should list students with pagination", async () => {
      const students = await service.findAll(1, 10, "desc" as orderEnum);
      expect(Array.isArray(students)).toBe(true);
      expect(students.length).toBeGreaterThan(0);
    });
  });

  describe("findById", () => {
    it("should find student by id", async () => {
      const student = await service.findById(studentId);
      expect(student?.id).toBe(studentId);
    });
  });

  describe("findByRa", () => {
    it("should find student by RA", async () => {
      const student = await service.findByRa("RA123456789");
      expect(student?.ra).toBe("RA123456789");
    });
  });

  describe("update", () => {
    it("should update student name", async () => {
      const { name, ...rest } = await service.findById(studentId);
      const updated = await service.update(studentId, {
        name: "Jane Doe",
        ...rest,
      });
      expect(updated.name).toBe("Jane Doe");
    });
  });

  describe("delete", () => {
    it("should delete student by id", async () => {
      const deleted = await service.delete(studentId);
      expect(deleted.id).toBe(studentId);

      const found = await service.findById(studentId);
      expect(found).toBeNull();
    });
  });
});
