"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authAPI, booksAPI, borrowAPI, usersAPI, adminAPI, activityAPI } from "@/lib/api"
import toast from "react-hot-toast"

// Auth Hooks
export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await authAPI.me()
      return res.data.data
    },
    retry: 1,
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success("Logged out successfully")
    },
    onError: () => {
      toast.error("Failed to logout")
    },
  })
}

// Books Hooks
export const useBooks = (params?: { category?: string; title?: string; author?: string; sort?: string }) => {
  return useQuery({
    queryKey: ["books", params],
    queryFn: async () => {
      const res = await booksAPI.getAll(params)
      return res.data.data
    },
  })
}

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: booksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast.success("Book added successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add book")
    },
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: booksAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast.success("Book deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete book")
    },
  })
}

// Borrow Hooks
export const useBorrowedBooks = () => {
  return useQuery({
    queryKey: ["borrow", "my-books"],
    queryFn: async () => {
      const res = await borrowAPI.getMyBooks()
      return res.data.data
    },
  })
}

export const useBorrowBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: borrowAPI.borrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      queryClient.invalidateQueries({ queryKey: ["borrow"] })
      queryClient.invalidateQueries({ queryKey: ["activity"] })
      toast.success("Book borrowed successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to borrow book")
    },
  })
}

export const useReturnBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: borrowAPI.return,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrow"] })
      queryClient.invalidateQueries({ queryKey: ["activity"] })
      toast.success("Book returned successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to return book")
    },
  })
}

// Users Hook
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await usersAPI.getAll()
      return res.data.data
    },
  })
}

// Admin Hooks
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await adminAPI.getUsers()
      return res.data.data
    },
  })
}

export const usePromoteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.promoteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success("User promoted to librarian")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to promote user")
    },
  })
}

export const useRevokeUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminAPI.revokeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success("User downgraded to student")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to revoke user")
    },
  })
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await adminAPI.getStats()
      return res.data.data
    },
  })
}

// Activity Hook
export const useActivity = () => {
  return useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await activityAPI.getActivity()
      return res.data.data
    },
  })
}
