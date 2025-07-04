import { Outlet, Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Music, 
  Newspaper, 
  FileText, 
  Archive, 
  Settings,
  LogOut,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { LanguageToggle } from "../LanguageToggle"

export function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Lineup", href: "/admin/lineup", icon: Music },
    { name: "News", href: "/admin/news", icon: Newspaper },
    { name: "Pages", href: "/admin/pages", icon: FileText },
    { name: "Archive", href: "/admin/archive", icon: Archive },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true
    if (path !== "/admin" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
              <Link to="/" className="text-xl font-bold text-gradient">
                Metal Gates
              </Link>
              <span className="text-xs text-muted-foreground bg-primary/20 px-2 py-1 rounded">
                Admin
              </span>
            </div>

            {/* Language Toggle */}
            <div className="px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Globe className="h-4 w-4" />
                Content Language
              </div>
              <LanguageToggle />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}