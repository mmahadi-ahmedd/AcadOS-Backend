import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@acados.com" },
    update: {},
    create: {
      email: "admin@acados.com",
      password: adminPassword,
      role: Role.ADMIN,
      name: "System Admin",
      isVerified: true,
    },
  });
  console.log("Admin created:", admin.email);

  const dept = await prisma.department.upsert({
    where: { code: "CSE" },
    update: {},
    create: { name: "Computer Science & Engineering", code: "CSE" },
  });

  const program = await prisma.program.upsert({
    where: { id: "seed-program-cse-bsc" },
    update: {},
    create: {
      id: "seed-program-cse-bsc",
      name: "B.Sc. in CSE",
      departmentId: dept.id,
      degreeLevel: "Undergraduate",
      totalCredits: 150,
    },
  });

  const course = await prisma.course.upsert({
    where: { code: "CSE101" },
    update: {},
    create: {
      code: "CSE101",
      title: "Introduction to Programming",
      creditHours: 3,
      departmentId: dept.id,
    },
  });

  console.log("Seed data ready:", { dept: dept.code, program: program.name, course: course.code });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });