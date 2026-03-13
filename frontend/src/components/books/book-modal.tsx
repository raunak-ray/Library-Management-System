"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Book } from "@/types"
import Image from "next/image"

interface BookModalProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole?: string
  onBorrow?: (bookId: string) => void
  onDelete?: (bookId: string) => void
  isBorrowLoading?: boolean
  isDeleteLoading?: boolean
}

export function BookModal({
  book,
  open,
  onOpenChange,
  userRole,
  onBorrow,
  onDelete,
  isBorrowLoading,
  isDeleteLoading,
}: BookModalProps) {
  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>{book.author}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {book.coverImage ? (
            <div className="relative h-80 w-full">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="h-80 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-lg">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="default" className="mt-1">
                {book.category}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 text-sm leading-relaxed">{book.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Available Copies</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {book.availableCopies}/{book.totalCopies}
              </p>
            </div>

            <div className="flex gap-2 mt-auto">
              {userRole === "student" && (
                <Button
                  onClick={() => {
                    if (onBorrow) {
                      onBorrow(book.id)
                      onOpenChange(false)
                    }
                  }}
                  disabled={book.availableCopies === 0 || isBorrowLoading}
                  className="flex-1"
                >
                  {isBorrowLoading ? "Borrowing..." : "Borrow Book"}
                </Button>
              )}

              {(userRole === "librarian" || userRole === "admin") && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (onDelete) {
                      onDelete(book.id)
                      onOpenChange(false)
                    }
                  }}
                  disabled={isDeleteLoading}
                  className="flex-1"
                >
                  {isDeleteLoading ? "Deleting..." : "Delete Book"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
