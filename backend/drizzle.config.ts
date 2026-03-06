import 'dotenv';
import { configDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

configDotenv();

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URI!,
  },
});
