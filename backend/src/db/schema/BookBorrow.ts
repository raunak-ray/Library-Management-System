import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { booksTable } from "./Book.ts";
import { usersTable } from "./User.ts";

export const bookBorrowTable = pgTable("book_borrow", {
        id: uuid().defaultRandom().primaryKey(),
        bookId: uuid().notNull()
            .references(() => booksTable.id, { onDelete: "cascade" }),
        userId: uuid().notNull()
            .references(() => usersTable.id, { onDelete: "cascade" }),
        borrowDate: timestamp().defaultNow().notNull(),
        returnDate: timestamp().notNull(),
    }
);