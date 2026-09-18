import { Server } from "http";
import app from "./app";
import prisma from "./config/prisma";
import { config } from "./config/env";

let server: Server;

async function main() {
  await prisma.$connect();
  console.log("Database connected");

  server = app.listen(config.port, () => {
    console.log(`AcadOS server running on port ${config.port}`);
  });
}

main();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
