"use client"

import { useState } from "react"
import { useMe, useBooks, useBorrowBook, useDeleteBook } from "@/hooks"
import { BooksGrid } from "@/components/books/books-grid"
import { BookModal } from "@/components/books/book-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Book } from "@/types"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BooksPage() {
  const { data: user, isLoading: userLoading } = useMe()
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [open, setOpen] = useState(false)
  const [searchTitle, setSearchTitle] = useState("")
  const [searchAuthor, setSearchAuthor] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sort, setSort] = useState("asc")

  const { data: books, isLoading } = useBooks({
    title: searchTitle,
    author: searchAuthor,
    category: selectedCategory === "all" ? "" : selectedCategory,
    sort,
  })

  const { mutate: borrowBook, isPending: isBorrowLoading } = useBorrowBook()
  const { mutate: deleteBook, isPending: isDeleteLoading } = useDeleteBook()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  const categories = [
    "fiction","non-fiction","technology","science","history",
    "biography","architecture","medical","law","business", "philosophy","education"
]

  const handleOpenModal = (book: Book) => {
    setSelectedBook(book)
    setOpen(true)
  }

  const handleBorrow = (bookId: string) => {
    borrowBook(bookId)
  }

  const handleDelete = (bookId: string) => {
    deleteBook(bookId)
  }

  if (userLoading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-emerald">All Books</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage your library collection
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="pl-10"
          />
        </div>

        <Input
          placeholder="Search by author..."
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
        />

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <BooksGrid
        books={books || []}
        isLoading={isLoading}
        onOpenModal={handleOpenModal}
      />

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        open={open}
        onOpenChange={setOpen}
        userRole={user?.role}
        onBorrow={handleBorrow}
        onDelete={handleDelete}
        isBorrowLoading={isBorrowLoading}
        isDeleteLoading={isDeleteLoading}
      />
    </div>
  )
}