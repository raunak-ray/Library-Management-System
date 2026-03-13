"use client"

import { useMe, useBooks, useBorrowedBooks, useActivity, useAdminStats } from "@/hooks"
import { StatCard } from "@/components/dashboard/stats-card"
import { ActivityList } from "@/components/dashboard/activity-list-v2"
import { BorrowTrendChart } from "@/components/charts/borrow-trend-chart"
import { UserRoleChart } from "@/components/charts/user-role-chart"
import { CategoryChart } from "@/components/charts/category-chart"
import { BookOpen, Users, BookMarked } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useMe()
  const { data: books } = useBooks()
  const { data: borrowedBooks } = useBorrowedBooks()
  const { data: activities } = useActivity()
  const { data: adminStats } = useAdminStats()
  const router = useRouter()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  if (userLoading) return null

  // Student Dashboard
  if (user?.role === "student") {
    const totalBooks = books?.length || 0
    const availableBooks = books?.filter((b) => b.availableCopies > 0).length || 0
    const borrowedCount = borrowedBooks?.filter((b) => b.status === true).length || 0

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient-emerald">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your library activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-primary" />}
            title="Total Books"
            value={totalBooks}
            description="Books in library"
          />
          <StatCard
            icon={<BookMarked className="h-5 w-5 text-accent" />}
            title="Available Books"
            value={availableBooks}
            description="Ready to borrow"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Borrowed by You"
            value={borrowedCount}
            description="Books in your collection"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <BorrowTrendChart
            data={adminStats?.borrowTrend || []}
          />
          <ActivityList
            activities={activities || []}
            isLoading={false}
          />
        </div>
      </div>
    )
  }

  // Librarian Dashboard
  if (user?.role === "librarian") {
    const totalBooks = books?.length || 0
    const availableBooks = books?.reduce((sum, b) => sum + b.availableCopies, 0) || 0
    const borrowedBooks_count = books?.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0) || 0

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient-emerald">
            Welcome, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Library management dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-primary" />}
            title="Total Books"
            value={totalBooks}
            description="Books in library"
          />
          <StatCard
            icon={<BookMarked className="h-5 w-5 text-accent" />}
            title="Available Copies"
            value={availableBooks}
            description="Ready for borrowing"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Borrowed Books"
            value={borrowedBooks_count}
            description="Currently borrowed"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryChart
            data={adminStats?.booksByCategory || []}
          />
          <BorrowTrendChart
            data={adminStats?.borrowTrend || []}
          />
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gradient-emerald">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          System overview and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-primary" />}
          title="Total Users"
          value={adminStats?.totalUsers || 0}
          description="System users"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-accent" />}
          title="Total Books"
          value={adminStats?.totalBooks || 0}
          description="Library collection"
        />
        <StatCard
          icon={<BookMarked className="h-5 w-5 text-primary" />}
          title="Available Books"
          value={adminStats?.availableBooks || 0}
          description="Ready to borrow"
        />
        <StatCard
          icon={<BookMarked className="h-5 w-5 text-accent" />}
          title="Borrowed Books"
          value={adminStats?.borrowedBooks || 0}
          description="Currently out"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart
          data={adminStats?.booksByCategory || []}
        />
        <UserRoleChart
          data={adminStats?.usersByRole || { student: 0, librarian: 0, admin: 0 }}
        />
      </div>

      {/* Borrow Trend */}
      <BorrowTrendChart
        data={adminStats?.borrowTrend || []}
      />
    </div>
  )
}
