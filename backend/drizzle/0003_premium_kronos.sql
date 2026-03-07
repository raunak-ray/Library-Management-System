CREATE TABLE "book_borrow" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bookId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"borrowDate" timestamp DEFAULT now() NOT NULL,
	"returnDate" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "book_borrow" ADD CONSTRAINT "book_borrow_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_borrow" ADD CONSTRAINT "book_borrow_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;