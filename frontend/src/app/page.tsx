"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useMe } from "@/hooks"

export default function page() {
  const router = useRouter()
  const { data: user, isLoading } = useMe()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  return null
}