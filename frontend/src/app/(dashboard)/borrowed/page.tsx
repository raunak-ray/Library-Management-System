"use client"

import { useMe, useBorrowedBooks, useReturnBook } from "@/hooks"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function BorrowedPage() {
  const { data: user, isLoading: userLoading } = useMe()
  const router = useRouter()
  const { data: borrowedBooks, isLoading } = useBorrowedBooks()
  const { mutate: returnBook, isPending } = useReturnBook()

  const capitalizeFirstLetter = (string: string) => {
    if (string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  console.log(borrowedBooks)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  if (userLoading) return null

  if (user?.role !== "student") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Only students can view borrowed books
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-emerald">
          Borrowed Books
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your borrowed books and due dates
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : borrowedBooks?.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No borrowed books</h3>
            <p className="text-muted-foreground">
              You haven&apos;t borrowed any books yet
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowedBooks?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.bookTitle}
                  </TableCell>
                  <TableCell>{capitalizeFirstLetter(record.author)}</TableCell>
                  <TableCell>
                    {new Date(record.borrowDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(record.returnDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        record.status 
                          ? "bg-primary/20 text-primary"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {record.status ? "Active" : "Returned"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {record.status && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => returnBook(record.id)}
                        disabled={isPending}
                      >
                        {isPending ? "Returning..." : "Return"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
