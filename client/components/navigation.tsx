"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  Brain,
  Upload,
  Bell,
  Settings,
  Menu,
  BarChart3,
  Mail,
  LogOut,
  User,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Risk Assessment", href: "/risk-assessment", icon: Brain },
  { name: "Data Import", href: "/data-import", icon: Upload },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Notifications", href: "/notifications", icon: Mail },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              mobile && "text-base",
            )}
            onClick={() => mobile && setOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-card border-r overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 text-primary-foreground" />
            </div>
            <span className="ml-2 text-xl font-bold text-foreground">EduGuard</span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-1">
              <NavItems />
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role || "User"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">EduGuard</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center mb-8 space-x-2">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold text-foreground">EduGuard</span>
                </div>
                <nav className="space-y-2 mb-8">
                  <NavItems mobile />
                </nav>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role || "User"}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  )
}
