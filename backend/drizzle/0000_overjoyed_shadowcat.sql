CREATE TYPE "public"."categoryEnum" AS ENUM('fiction', 'technology', 'architecture', 'medical', 'law');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('student', 'librarian', 'admin');--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"category" "categoryEnum" DEFAULT 'fiction' NOT NULL,
	"description" varchar(255) NOT NULL,
	"totalCopies" integer DEFAULT 1,
	"availableCopies" integer DEFAULT 1,
	"coverImage" varchar(255) DEFAULT '',
	CONSTRAINT "copies_constraint" CHECK ("books"."totalCopies" >= 0 AND "books"."availableCopies" >= 0 AND "books"."availableCopies" <= "books"."totalCopies")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "userRole" DEFAULT 'student' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
