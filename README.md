# AcadOS — University Management System API

A production-grade backend for managing university academics end-to-end: student registration, course enrollment, attendance, exams, GPA calculation, and semester fee payments — built as a fully role-based REST API with zero frontend dependency.

**Live API:** https://acados-backend.vercel.app
**API Docs (Postman):** <paste your Postman share link here>
**Demo Video:** <paste your video link here>

---

## Overview

AcadOS models the real academic lifecycle of a university:

Department → Program → Course → Semester → Section → Enrollment

A `Course` is a fixed catalog entry; a `Section` is one live offering of that course, in one semester, taught by one instructor, with a fixed seat capacity. Students enroll in sections — not courses directly — and the system enforces prerequisites and seat limits atomically at the database level.

Three roles drive the system: **Student**, **Instructor**, and **Admin/Registrar** — each with strictly enforced, independently tested permissions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js, TypeScript, Express.js |
| Database | PostgreSQL (hosted on Neon) |
| ORM | Prisma — relations, indexing, transactions |
| Validation | Zod |
| Auth | JWT (access + refresh tokens), bcrypt password hashing |
| Payments | SSLCommerz (sandbox integration, real payment lifecycle) |
| Security | Helmet, CORS, express-rate-limit |
| Deployment | Vercel Serverless Functions |
| Docs | Postman Collection |

---

## Architecture

Routes → Controllers → Services → Prisma → PostgreSQL

Every module (auth, department, course, enrollment, payment, etc.) follows a consistent 4-file pattern — `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.validation.ts` — keeping business logic isolated from HTTP concerns and fully unit-testable.

All responses follow one standardized shape:

{ "success": true, "message": "Operation successful", "data": {} }
{ "success": false, "message": "Something went wrong", "errors": [] }

---

## Engineering Highlights

- **Transaction-safe enrollment** — seat-capacity and prerequisite checks run inside a single Prisma `$transaction`, preventing two students from racing for the last seat in a section.
- **Automated GPA/CGPA engine** — grades are converted to grade points on entry; finalizing a section recalculates a student's CGPA as a credit-hour-weighted average across all completed courses.
- **Role-based access control** — enforced via middleware on every protected route; verified with explicit 403 tests across all 3 roles (not just implemented — tested).
- **Soft deletes everywhere** — no destructive deletes on core resources; `deletedAt` timestamps preserve history and referential integrity.
- **Audit logging** — critical actions (role changes, deletions) are automatically logged with before/after state, queryable by admins.
- **Real payment lifecycle** — SSLCommerz integration handling session initiation, browser redirect, and **server-to-server IPN webhook verification** — not a simulated "mark as paid" shortcut.
- **Pagination, filtering, and search** — implemented consistently across list endpoints, not bolted on to just one.

---

## Core Modules (20+ endpoints)

- **Auth** — register, login, JWT refresh, logout
- **Users** — profile management, role-specific onboarding (Student/Instructor profile completion)
- **Academic Structure** — Department, Program, Course (with prerequisite graph), Semester, Section CRUD
- **Enrollment** — registration with prerequisite + capacity validation, drop, transcript view
- **Attendance** — bulk marking by instructor, per-student history
- **Exams & Results** — exam creation, bulk result entry, automatic grade-point calculation
- **Fees & Payments** — fee generation, SSLCommerz checkout, webhook-verified status updates
- **Admin** — user management, role updates, dashboard statistics, audit log viewer

---

## Getting Started

git clone https://github.com/mmahadi-ahmedd/AcadOS-Backend.git
cd AcadOS-Backend
npm install

Create a `.env` file:

DATABASE_URL=your_postgresql_connection_string
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d
SSLCOMMERZ_STORE_ID=your_sandbox_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sandbox_store_password
SSLCOMMERZ_IS_LIVE=false

npx prisma migrate dev
npx prisma db seed
npm run dev

**Demo Admin (seeded):**

Email: admin@acados.com
Password: Admin@123

---

## Project Structure

src/
├── app.ts
├── server.ts
├── config/          # env, prisma client
├── middlewares/      # auth, error handling, validation
├── utils/            # shared helpers (AppError, catchAsync, sendResponse, JWT, audit logging)
├── modules/
│   ├── auth/
│   ├── user/
│   ├── department/
│   ├── program/
│   ├── course/
│   ├── semester/
│   ├── section/
│   ├── enrollment/
│   ├── attendance/
│   ├── exam/
│   ├── result/
│   ├── fee/
│   ├── payment/
│   └── admin/
└── routes/
prisma/
├── schema.prisma
└── seed.ts

---

## Author

**Mahadi Ahmed** — Backend-focused MERN stack developer
Portfolio: https://mahadi-ahmed-portfolio-67a1e.web.app/