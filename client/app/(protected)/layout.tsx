"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { authFetchCurrent } from "@/redux/action/userAction"
import { useDispatch, useSelector } from "react-redux"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoading } = useSelector ((state: any) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(authFetchCurrent() as any)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [dispatch])

  useEffect(() => {
    if (!isInitializing && !isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, isInitializing, router])

  if (isInitializing || isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
