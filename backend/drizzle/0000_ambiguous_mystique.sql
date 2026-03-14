CREATE TYPE "public"."userRole" AS ENUM('student', 'librarian', 'admin');--> statement-breakpoint

--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "userRole" DEFAULT 'student' NOT NULL,
	"test" varchar DEFAULT 'hello',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);