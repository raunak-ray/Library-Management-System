ALTER TABLE "books" ALTER COLUMN "totalCopies" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "availableCopies" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_title_unique" UNIQUE("title");