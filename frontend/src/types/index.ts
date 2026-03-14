export type UserRole = "student" | "librarian" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string
  totalCopies: number
  availableCopies: number
  coverImage?: string
  createdAt: string
}

export interface BorrowRecord {
  id: string
  userId: string
  bookId: string
  bookTitle: string,
  author: string,
  borrowDate: string
  returnDate: string
  dueDate: string
  status: boolean,
  createdAt: string
}

export interface AuthResponse {
  user: User
  token?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
