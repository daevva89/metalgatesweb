import { useState, useEffect } from "react"
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaMapPin } from "react-icons/fa"
import { getSiteAssets } from "@/api/festival"

interface ContactEmail {
  purpose: string;
  email: string;
}

export function Footer() {
  const [contactEmails, setContactEmails] = useState<ContactEmail[]>([]);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const data = await getSiteAssets();
      setContactEmails(data.assets?.contactEmails || []);
    } catch (error) {
      console.error("Footer: Error loading contact info:", error);
    }
  };

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
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/metalgatesfestival"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/metalgatesfestival"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaYoutube className="h-5 w-5" />
            </a>
          </div>

          {/* Contact Info */}
          {contactEmails.length > 0 && (
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <FaEnvelope className="h-4 w-4" />
                <span>{contactEmails[0].email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaMapPin className="h-4 w-4" />
                <span>Quantic Club, Bucharest</span>
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2024 Metal Gates Festival. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}