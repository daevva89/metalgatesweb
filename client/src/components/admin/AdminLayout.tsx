import { Outlet, Link, useLocation } from "react-router-dom"
import { 
  FaThLarge, 
  FaMusic, 
  FaNewspaper, 
  FaFileAlt, 
  FaArchive, 
  FaCog,
  FaSignOutAlt,
  FaGlobe
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { LanguageToggle } from "../LanguageToggle"

export function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: FaThLarge },
    { name: "Lineup", href: "/admin/lineup", icon: FaMusic },
    { name: "News", href: "/admin/news", icon: FaNewspaper },
    { name: "Pages", href: "/admin/pages", icon: FaFileAlt },
    { name: "Archive", href: "/admin/archive", icon: FaArchive },
    { name: "Settings", href: "/admin/settings", icon: FaCog },
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
                <FaGlobe className="h-4 w-4" />
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
                <FaSignOutAlt className="mr-2 h-4 w-4" />
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