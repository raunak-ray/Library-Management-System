"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  bookTitle: string
  action: "borrowed" | "returned"
  date: string
}

interface ActivityListProps {
  activities: Activity[]
  isLoading?: boolean
}

export function ActivityList({ activities, isLoading }: ActivityListProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    <span className="text-primary">{activity.bookTitle}</span>
                    <span className="text-muted-foreground mx-2">was</span>
                    <span
                      className={
                        activity.action === "borrowed"
                          ? "text-accent"
                          : "text-green-400"
                      }
                    >
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
