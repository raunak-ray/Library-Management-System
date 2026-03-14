"use client"

import { BookCard } from "@/components/books/book-card"
import { Book } from "@/types"

interface BooksGridProps {
  books: Book[]
  isLoading?: boolean
  onOpenModal: (book: Book) => void
}

export function BooksGrid({
  books,
  isLoading,
  onOpenModal,
}: BooksGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onOpenModal={onOpenModal} />
      ))}
    </div>
  )
}
