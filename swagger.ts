import swaggerJSDoc from "swagger-jsdoc";
import { Express, Request, Response } from "express";
import { serve, setup } from "swagger-ui-express";
import { logger } from "./src/shared/log/_logger";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "+A Educação Challenge",
      version: "1.0.0",
    },
    servers: [
      {
        url: "/api",
        description: "Base Url",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/module/core/students/routes/students.routes.ts",
    "./src/module/core/users/routes/users.routes.ts",
    "./prisma/schema.prisma",
    "./src/shared/auth/routes/auth.routes.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app: Express, port: number) {
  app.use("/docs", serve, setup(swaggerSpec));
  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
