// Prisma configuration file
import { defineConfig } from "prisma/config";

// 使用Neon PostgreSQL数据库
const DATABASE_URL = "postgresql://neondb_owner:npg_SuPOb2scv6hZ@ep-delicate-river-ahizjt90-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
