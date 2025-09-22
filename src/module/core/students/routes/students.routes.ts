import { requireAuth } from "../../../../shared/middleware/auth.middleware";
import { StudentsController } from "../controller/students.controller";
import { StudentsService } from "../service/students.service";

export const studentsRoutes = (app) => {
  // Student Module Setup
  const studentsService = new StudentsService();
  const studentsController = new StudentsController(studentsService);

  // Student Routes
  /**
   * @openapi
   * /students:
   *   get:
   *     tags:
   *       - Students
   *     summary: Get a list of students
   *     description: Get the students from database
   *     responses:
   *       200:
   *         description: Successful response with list of students
   */
  app.get("/students", requireAuth, (req, res, next) =>
    studentsController.findAll(req, res, next)
  );

  /**
   * @openapi
   * /students/{id}:
   *   get:
   *     tags:
   *       - Students
   *     summary: Get a student by ID
   *     description: Returns a single student by its unique identifier.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the student
   *     responses:
   *       200:
   *         description: Successful response with the student data
   *       404:
   *         description: Student not found
   */
  app.get("/students/:id", requireAuth, (req, res, next) =>
    studentsController.findById(req, res, next)
  );
  /**
   * @openapi
   * /students/{ra}:
   *   get:
   *     tags:
   *       - Students
   *     summary: Get a student by RA
   *     description: Returns a single student by its unique identifier. (RA)
   *     parameters:
   *       - name: ra
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The RA of the student
   *     responses:
   *       200:
   *         description: Successful response with the student data
   *       404:
   *         description: Student not found
   */
  app.get("/students/ra/:ra", requireAuth, (req, res, next) =>
    studentsController.findByRa(req, res, next)
  );

  /**
   * @openapi
   * /students:
   *   post:
   *     tags:
   *       - Students
   *     summary: Create a new student
   *     description: Create a Student in the database
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "john@example.com"
   *               ra:
   *                 type: string
   *                 example: "RA1234567890"
   *               cpf:
   *                 type: string
   *                 example: "02431097684"
   *             required:
   *               - name
   *               - email
   *               - ra
   *               - cpf
   *     responses:
   *       201:
   *         description: Student created successfully
   *       400:
   *         description: Bad Request
   */
  app.post("/students", requireAuth, (req, res, next) =>
    studentsController.create(req, res, next)
  );
  /**
   * @openapi
   * /students/{id}:
   *   put:
   *     tags:
   *       - Students
   *     summary: Update a student
   *     description: Update an existing student's name or CPF by its ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the student to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               cpf:
   *                 type: string
   *                 example: "02431097684"
   *             required:
   *               - name
   *               - email
   *     responses:
   *       200:
   *         description: Student updated successfully
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Student not found
   */
  app.put("/students/:id", requireAuth, (req, res, next) =>
    studentsController.update(req, res, next)
  );
  /**
   * @openapi
   * /students/{id}:
   *   delete:
   *     tags:
   *       - Students
   *     summary: Delete a student
   *     description: Remove a student from the database by its ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the student to delete
   *     responses:
   *       204:
   *         description: Student deleted successfully (no content)
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Student not found
   */
  app.delete("/students/:id", requireAuth, (req, res, next) =>
    studentsController.delete(req, res, next)
  );
};
