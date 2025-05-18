"use client"

import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Menu, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { authFetchCurrent, authLogout } from "@/redux/action/userAction"

export function Navbar() {
  const { user } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await dispatch(authLogout() as any);
      // toast.warning("You have been logged out of your account")
      router.push("/")
    } catch (error) {
      toast.error("There was an error logging out. Please try again.")
      console.log(error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center  mx-auto">
        <Link
          href={user ? (user.userType === "BUYER" ? "/buyer/dashboard" : "/seller/dashboard") : "/"}
          className="flex items-center gap-2"
        >
          <span className="font-bold">ProjectBid</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {user.userType === "BUYER" ? (
                  <>
                    <Link href="/buyer/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/buyer/projects" className="text-sm font-medium transition-colors hover:text-primary">
                      My Projects
                    </Link>
                    <Link
                      href="/buyer/create-project"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Create Project
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/seller/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/seller/projects" className="text-sm font-medium transition-colors hover:text-primary">
                      Find Projects
                    </Link>
                    <Link href="/seller/bids" className="text-sm font-medium transition-colors hover:text-primary">
                      My Bids
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          <ModeToggle />

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            {user ? (
              <>
                {user.userType === "BUYER" ? (
                  <>
                    <Link href="/buyer/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/buyer/projects" className="text-sm font-medium transition-colors hover:text-primary">
                      My Projects
                    </Link>
                    <Link
                      href="/buyer/create-project"
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Create Project
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/seller/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href="/seller/projects" className="text-sm font-medium transition-colors hover:text-primary">
                      Find Projects
                    </Link>
                    <Link href="/seller/bids" className="text-sm font-medium transition-colors hover:text-primary">
                      My Bids
                    </Link>
                  </>
                )}
                <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                  Profile
                </Link>
                <Link href="/settings" className="text-sm font-medium transition-colors hover:text-primary">
                  Settings
                </Link>
                <Button variant="ghost" className="justify-start p-0" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-sm font-medium transition-colors hover:text-primary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="text-sm font-medium transition-colors hover:text-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
