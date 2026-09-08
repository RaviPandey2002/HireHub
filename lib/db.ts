import { PrismaClient } from "@prisma/client";
import { env } from "./env";

declare global {
  var prisma: PrismaClient | undefined;
}

// Ensure the prisma instance is re-used during hot-reloading
// Otherwise, a new client will be created on every reload
export const db: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = db;
if (env.NODE_ENV === 'development') global.prisma = db;