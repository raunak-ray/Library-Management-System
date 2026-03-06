import { sql } from "drizzle-orm";
import { check, integer, numeric, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("categoryEnum", [
    "fiction",
    "non-fiction",
    "technology",
    "science",
    "history",
    "biography",
    "architecture",
    "medical",
    "law",
    "business",
    "philosophy",
    "education"
]);

export const booksTable = pgTable("books", 
    {
        id: uuid().defaultRandom().primaryKey(),
        title: varchar({length: 255}).notNull().unique(),
        author: varchar({length: 255}).notNull(),
        category: categoryEnum().notNull().default("fiction"),
        description: varchar({length: 255}).notNull(),
        totalCopies: integer().default(1).notNull(),
        availableCopies: integer().default(1).notNull(),
        coverImage: varchar({length: 255}).default("")
    },
    (table) => ({
        copiesConstraint: check(
            "copies_constraint",
            sql`${table.totalCopies} >= 0 AND ${table.availableCopies} >= 0 AND ${table.availableCopies} <= ${table.totalCopies}`
        )
    })
);