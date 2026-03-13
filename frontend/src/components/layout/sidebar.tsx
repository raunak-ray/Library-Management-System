"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMe, useLogout } from "@/hooks"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Plus,
  Users,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"

const sidebarItems = {
  student: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "All Books", href: "/books" },
    { icon: BookMarked, label: "Borrowed Books", href: "/borrowed" },
  ],
  librarian: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "All Books", href: "/books" },
    { icon: Plus, label: "Add Book", href: "/add-book" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "All Books", href: "/books" },
    { icon: Plus, label: "Add Book", href: "/add-book" },
    { icon: Users, label: "Users", href: "/admin-users" },
  ],
}

export function Sidebar() {
  const { data: user } = useMe()
  const { mutate: logout } = useLogout()
  const router = useRouter()
  const pathname = usePathname()

  const items = user ? sidebarItems[user.role] : []

  return (
    <aside className="sticky top-0 hidden h-screen w-64 border-r border-border bg-card md:flex md:flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">LMS</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:bg-red-500/10 hover:text-red-600"
          onClick={() => {
            logout()
            router.push("/login")
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
