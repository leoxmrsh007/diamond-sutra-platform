// Prisma configuration file
import { defineConfig } from "prisma/config";

// 直接设置数据库连接字符串
const DATABASE_URL = "postgresql://xin_som:xin_som_password@localhost:5433/diamond_sutra";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
