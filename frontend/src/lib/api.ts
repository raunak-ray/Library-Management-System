import { api } from "@/lib/axios"
import { User, Book, BorrowRecord, ApiResponse } from "@/types"

// Auth
export const authAPI = {
  me: () => api.get<ApiResponse<User>>("/auth/me"),
  logout: () => api.post("/auth/logout"),
}

// Books
export const booksAPI = {
  getAll: (params?: { category?: string; title?: string; author?: string; sort?: string }) =>
    api.get<ApiResponse<Book[]>>("/books", { params }),
  create: (formData: FormData) =>
    api.post<ApiResponse<Book>>("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) => api.delete(`/books/${id}`),
}

// Borrow
export const borrowAPI = {
  getMyBooks: () => api.get<ApiResponse<BorrowRecord[]>>("/borrow"),
  borrow: (bookId: string) => api.post(`/borrow/${bookId}`),
  return: (borrowId: string) => api.post(`/borrow/return/${borrowId}`),
}

// Users
export const usersAPI = {
  getAll: () => api.get<ApiResponse<User[]>>("/users"),
}

// Admin
export const adminAPI = {
  getUsers: () => api.get<ApiResponse<User[]>>("/admin/users"),
  promoteUser: (id: string) => api.patch(`/admin/users/${id}/promote`),
  revokeUser: (id: string) => api.patch(`/admin/users/${id}/revoke`),
  getStats: () => api.get<ApiResponse<any>>("/admin/stats"),
}

// Activity
export const activityAPI = {
  getActivity: () => api.get<ApiResponse<any[]>>("/activity"),
}
