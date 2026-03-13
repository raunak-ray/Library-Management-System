"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book } from "@/types"
import Image from "next/image"

interface BookCardProps {
  book: Book
  onOpenModal: (book: Book) => void
}

export function BookCard({ book, onOpenModal }: BookCardProps) {
  return (
    <Card
      className="bg-card border-border cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
      onClick={() => onOpenModal(book)}
    >
      <CardContent className="p-0">
        {book.coverImage ? (
          <div className="relative h-48 w-full">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-t-lg">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
      </CardContent>

      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{book.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
        <p className="text-xs text-accent uppercase mt-1">{book.category}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {book.availableCopies}/{book.totalCopies}
          </span>
          <span className="text-xs text-muted-foreground">copies</span>
        </div>
      </div>
    </Card>
  )
}
