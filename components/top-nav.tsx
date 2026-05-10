"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Users", href: "/users" },
  { name: "News", href: "/news" },
  { name: "My items", href: "/my-items" },
  { name: "NACT", href: "/nact" },
  { name: "TADT", href: "/tadt" },
  { name: "CAPs", href: "/" },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center">
        {navItems.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" || pathname.startsWith("/caps")
            : pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-4 py-4 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          )
        })}
      </div>
      <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </nav>
  )
}
