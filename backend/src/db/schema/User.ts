import { integer, pgEnum, PgEnumColumn, pgTable, PgUUID, uuid, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("userRole", ["student", "librarian", "admin"])

export const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: varchar({length: 255}).notNull(),
    role: roleEnum().notNull().default("student"),
})