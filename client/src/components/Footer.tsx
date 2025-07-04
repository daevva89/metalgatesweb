import { Facebook, Instagram, Youtube, Mail, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 glass border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Social Media */}
          <div className="flex items-center space-x-4">
            <a
              href="https://facebook.com/metalgatesfestival"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/metalgatesfestival"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/metalgatesfestival"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>info@metalgates.ro</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Quantic Club, Bucharest</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2024 Metal Gates Festival. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}