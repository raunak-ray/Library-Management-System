"use client"

import { useMe, useAdminUsers, usePromoteUser, useRevokeUser } from "@/hooks"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

export default function AdminUsersPage() {
  const { data: user, isLoading: userLoading } = useMe()
  const router = useRouter()
  const { data: users, isLoading } = useAdminUsers()
  const { mutate: promote, isPending: isPromoting } = usePromoteUser()
  const { mutate: revoke, isPending: isRevoking } = useRevokeUser()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  if (userLoading) return null

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Only admins can view user management
          </p>
        </div>
      </div>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "librarian":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-emerald">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and their roles in the system
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : users && users.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              There are no users in the system yet
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeColor(u.role)}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {u.role === "student" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => promote(u.id)}
                        disabled={isPromoting}
                      >
                        <ArrowUp className="h-4 w-4" />
                        {isPromoting ? "Promoting..." : "Promote"}
                      </Button>
                    )}
                    {u.role === "librarian" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-red-500 hover:text-red-600"
                        onClick={() => revoke(u.id)}
                        disabled={isRevoking}
                      >
                        <ArrowDown className="h-4 w-4" />
                        {isRevoking ? "Revoking..." : "Revoke"}
                      </Button>
                    )}
                    {u.role === "admin" && (
                      <span className="text-xs text-muted-foreground">
                        System Admin
                      </span>
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
