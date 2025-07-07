import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaBars, FaExternalLinkAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { LanguageToggle } from "./LanguageToggle"
import { getSiteAssets, getFestivalInfo } from "@/api/festival"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [siteAssets, setSiteAssets] = useState({ 
    logo: null, 
    heroImage: null, 
    bannerText: ""
  })
  const [festivalInfo, setFestivalInfo] = useState({
    ticketUrl: ""
  })
  const location = useLocation()

  useEffect(() => {
    loadSiteAssets()
    loadFestivalInfo()
  }, [])

  const loadSiteAssets = async () => {
    try {
      console.log("Header: Loading site assets...")
      const data = await getSiteAssets()
      console.log("Header: Received site assets:", data.assets)
      setSiteAssets({
        logo: data.assets?.logo || null,
        heroImage: data.assets?.heroImage || null,
        bannerText: data.assets?.bannerText || ""
      })
    } catch (error) {
      console.error("Header: Error loading site assets:", error)
    }
  }

  const loadFestivalInfo = async () => {
    try {
      console.log("Header: Loading festival info...")
      const data = await getFestivalInfo()
      console.log("Header: Received festival info:", data)
      setFestivalInfo({
        ticketUrl: data?.ticketUrl || ""
      })
    } catch (error) {
      console.error("Header: Error loading festival info:", error)
    }
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Lineup", href: "/lineup" },
    { name: "News", href: "/news" },
    { name: "Info", href: "/info" },
    { name: "Archive", href: "/archive" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b">
      {/* Promotional Banner */}
      <div className="bg-primary/20 text-center py-2 px-4">
        <p className="text-sm text-primary-foreground">
          {siteAssets.bannerText}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {siteAssets.logo ? (
              <img 
                src={siteAssets.logo} 
                alt="Metal Gates Festival" 
                className="h-8 max-w-48 object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-gradient">Metal Gates</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <LanguageToggle /> */}
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a
                href={festivalInfo.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Buy Tickets
                <FaExternalLinkAlt className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaBars className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* <div className="pt-4 border-t">
                    <LanguageToggle />
                  </div> */}
                  
                  <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                    <a
                      href={festivalInfo.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Buy Tickets
                      <FaExternalLinkAlt className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}