# 🧑‍🏫 Class Manager (Backend)

This project is a **Higher Education management system** where administrator users can register and manage the institution's students.

---

## 🧑🏻‍💻 Project Technologies

### ⚡ Node.js  
Node.js is a powerful, open-source JavaScript runtime built on Chrome's V8 engine that executes JavaScript on the server side. Its **non-blocking, event-driven architecture** makes it ideal for scalable, high-performance applications such as real-time APIs.  
It also benefits from a vast ecosystem of npm packages and allows developers to use **JavaScript end-to-end**.

### 🌐 Express  
Express.js is a minimal and flexible web framework for Node.js. It provides robust features for routing, middleware, and HTTP handling, enabling scalable and maintainable REST APIs with a clean structure.

### 🛠️ Prisma  
Prisma is a modern, type-safe ORM for Node.js and TypeScript. It offers **auto-completion**, easy migrations, and a declarative schema that integrates smoothly with relational databases (PostgreSQL, MySQL, SQLite) and MongoDB.

### 🔑 JWT  
JSON Web Token is a compact and secure way to transmit information between parties. Widely used for authentication and authorization, **JWT is stateless**, supports fine-grained access control, and scales effortlessly across distributed systems.

---

## 🎯 Project Specifications

The codebase focuses on:
- **Low learning curve** – easy onboarding for new contributors.  
- **Clean structure and responsiveness** – simplifying future features and fixes.

---

## ⚙️ Architecture

This project follows a **Modular Monolith** approach:  
each module is **functionally independent** while sharing core functionalities across the system.  
It borrows concepts from **microservices**, but everything resides in a **single codebase**.

### 📁 Folder Structure (Macro View)
---
```bash
🗂️ prisma/
├─ 📜 migrations/
└─ 📝 schema.prisma


💻 src/
├─ 🧩 module/
│ ├─ 🏛️ core/
│ │ └─ 🎓 app module/
│ │ ├─ 🕹️ controller/
│ │ ├─ 🗄️ model/
│ │ ├─ 🛣️ routes/
│ │ ├─ ⚙️ service/
│ │ └─ 🧪 tests/
│ └─ 🔗 http/
└─ 🔁 shared/
├─ 🔐 auth/
│ ├─ 🕹️ controller/
│ ├─ 🛣️ routes/
│ ├─ ⚙️ service/
│ └─ 🧪 tests/
├─ 🚨 exception/
├─ 📝 log/
│ └─ 📄 _logger.ts
├─ 🧩 middleware/
├─ 🗄️ model/
├─ 💾 persistence/
└─ 🛠️ utils/
```
---

### 🏗️ Macro Structure

- **🧩 Module**  
  Houses all **feature-specific logic**. Each module behaves like a **self-contained microservice**, for example:  
  - Cleaning staff management  
  - Internal employee records  
  - Course scheduling following institutional rules  

- **🔁 Shared**  
  Contains all **reusable, system-wide components**, such as:  
  - 🔐 Authentication  
  - 🚨 Exceptions  
  - 🧩 Middleware  
  - 🛠️ Utilities

---

### 🧠 Understanding the Layers

**Inside 🧩 Module**  
- **🏛️ core** – domain logic and business rules.  
- **🔗 http** – connections to external APIs or services.

**Inside 🔁 Shared**  
- Global resources like **🚨 exception** and **🔐 auth**, ensuring reliability and cross-cutting security.

---

## 🚀 Module Architecture

Modules follow a **Hexagonal Architecture (Ports & Adapters)**:

- The **domain core** remains isolated from external concerns.  
- **Ports** define module boundaries via interfaces.  
- **Adapters** implement those interfaces to connect with databases, APIs, message brokers, or UIs.

**Key Benefits**
- Business logic evolves independently of infrastructure.
- External services can be swapped with minimal impact.
- Testing is simplified through domain isolation and mock adapters.

---

## 📦 Third-Party Libs

- 🔒 **bcrypt**: Library for hashing passwords, ensuring secure storage of user credentials.
- 🍪 **cookie-parser**: Express middleware to read and manipulate cookies sent by the client in HTTP requests.
- 🌐 **cors**: Middleware to enable **Cross-Origin Resource Sharing (CORS)**, allowing different domains to safely access your API.
- ⚡ **express**: Minimalist Node.js framework used to quickly create APIs and web applications.
- 🛡️ **jsonwebtoken**: Library for creating and verifying JWT tokens, commonly used for user authentication and authorization.
- 🧪 **supertest**: Tool for testing HTTP APIs, allowing simulation of requests and automated response checks.
- ✅ **jest**: Testing framework for JavaScript and Node.js, providing mocks, snapshots, and test coverage.
- 📜 **winston**: Logging library for Node.js, enabling flexible and configurable log management.
- 🗄️ **prisma**: Modern ORM for Node.js and TypeScript, simplifying database interaction with a strongly-typed schema.

---

## 🏃 Future Sprints

The current version of the project has delivered a functional **MVP (v1.0.0)**, providing core features for managing students and basic administrative functionalities. For the next sprints, the focus will be on enhancing scalability, security, and user management. Planned improvements include:

- **Containerization and Deployment**: Package the application using **Docker** and deploy it with **AWS** services, leveraging **Kubernetes** for orchestration and scalability.
- **Role-Based Access Control (RBAC)**: Implement a **Roles system** where different administrative levels can manage employees and students with permissions tailored to their responsibilities.
- **Class and Student Management**: Introduce a comprehensive system to manage classes, assign students to lessons, track grades, and generate **report cards**.

These enhancements aim to move the project from a basic MVP to a robust, production-ready educational management system with improved security, maintainability, and scalability.

## 🔮 Planned Features – API Documentation (Future Sprints)

### 1️⃣ Docker + AWS + Kubernetes
| Feature                  | Description                                                                 | Notes / Configurations                                    |
|--------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------|
| Containerization         | Package the application using Docker                                        | Create Dockerfile and docker-compose for local setup     |
| Cloud Deployment         | Deploy app on AWS (EC2, RDS, S3, etc.)                                      | Use environment variables for secrets and configs        |
| Orchestration            | Manage containers with Kubernetes                                           | Define deployment, service, and ingress YAML files       |

---

### 2️⃣ Role-Based Access Control (RBAC)
| Route / Feature                  | HTTP Method | Description                                        | Roles Allowed                  |
|---------------------------------|-------------|----------------------------------------------------|--------------------------------|
| `/roles`                         | GET         | List all roles                                     | Admin                          |
| `/roles`                         | POST        | Create a new role                                  | Admin                          |
| `/users/:id/assign-role`         | PUT         | Assign a role to a user                             | Admin                          |
| `/users/:id`                      | GET         | Get user details                                   | Admin, Manager                 |
| `/users/:id`                      | PUT         | Update user details                                | Admin, Manager                 |

---

### 3️⃣ Classes and Student Management
| Route / Feature                  | HTTP Method | Description                                        | Roles Allowed                  |
|---------------------------------|-------------|----------------------------------------------------|--------------------------------|
| `/classes`                       | GET         | List all classes                                   | Admin, Teacher                 |
| `/classes`                       | POST        | Create a new class                                 | Admin                          |
| `/classes/:id`                    | GET         | Get class details and enrolled students           | Admin, Teacher                 |
| `/classes/:id/students`           | POST        | Enroll student in class                            | Admin, Teacher                 |
| `/grades`                         | POST        | Assign grades to students                          | Teacher                        |
| `/report-card/:studentId`         | GET         | Generate report card for a student                 | Admin, Teacher, Student        |

---

### Notes
- All routes should be protected using **JWT authentication**.
- Role-based permissions must be verified in middleware before route execution.
- Environment variables will be required for AWS integration and database connections.
- Future improvements could include notifications, scheduling, and analytics dashboards.

---

## Documentation

##🧑‍🚀 [Postman Collection](https://web.postman.co/workspace/7b25718c-f2a3-4292-a6b0-2ab3588056e5)

---

## ✏️ Project Initialization

Clone the repository and install dependencies:

```bash
npm install
# or
yarn
Run Prisma migrations:

npx prisma migrate deploy
Start the development server:

npm run dev
# or
yarn run dev
```

## 🧑🏻‍🎨 Author
Pedro Lucas Lopes Paraguai
Developer passionate about continuous learning and innovation across Front-end and Back-end technologies.
Five years of experience building scalable and maintainable web applications.

## 🏷️ Tags

![NodeJS](https://img.shields.io/badge/Node.js-grey?logo=node.js&logoColor=green)
![Prisma](https://img.shields.io/badge/Prisma-grey?logo=prisma)
![Typescript](https://img.shields.io/badge/Typescript-grey?logo=typescript)
![Yarn](https://img.shields.io/badge/Yarn-grey?logo=yarn)
![Git](https://img.shields.io/badge/Jest-grey?logo=jest)
![Git](https://img.shields.io/badge/Git-grey?logo=git)
