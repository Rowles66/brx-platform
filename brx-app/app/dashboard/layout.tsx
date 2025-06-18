"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  Home,
  FileText,
  Dumbbell,
  Users,
  User,
  MessageSquare,
  CheckSquare,
  CalendarDays,
  Settings,
  ChevronRight,
  Menu,
  Clock,
  Zap,
  LayoutGrid,
  Bell,
  ListIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard", active: true },
  { name: "Plans", icon: FileText, href: "#" },
  { name: "Exercises", icon: Dumbbell, href: "#" },
  { name: "Groups", icon: Users, href: "#" },
  { name: "Clients", icon: User, href: "#" },
  { name: "Message A Coach", icon: MessageSquare, href: "#" },
  { name: "Automations", icon: CheckSquare, href: "#" },
  { name: "Schedule", icon: CalendarDays, href: "#", hasMore: true },
  { name: "Account", icon: Settings, href: "#", hasMore: true },
]

const Logo = () => (
  <div className="text-2xl font-bold text-neutral-800 tracking-tight p-4">
    BRX <span className="font-semibold">PERFORMANCE</span>
  </div>
)

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)}></div>}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <Logo />
          <nav className="flex-grow px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium group",
                  item.active
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn("mr-3 h-5 w-5", item.active ? "text-white" : "text-gray-500 group-hover:text-gray-600")}
                  aria-hidden="true"
                />
                {item.name}
                {item.hasMore && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <Link
              href="#"
              className="flex items-center text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              <ListIcon className="mr-2 h-5 w-5" />
              Edit Navigation
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

const Header = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Clock className="h-5 w-5" />
              <span className="sr-only">View history</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Zap className="h-5 w-5" />
              <span className="sr-only">Quick actions</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">Apps</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setIsOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  )
}
