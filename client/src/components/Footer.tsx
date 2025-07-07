import { useState, useEffect } from "react"
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaMapPin } from "react-icons/fa"
import { getSiteAssets, getInfoPage } from "@/api/festival"

interface ContactEmail {
  purpose: string;
  email: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export function Footer() {
  const [contactEmails, setContactEmails] = useState<ContactEmail[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "https://facebook.com/metalgatesfestival",
    instagram: "https://instagram.com/metalgatesfestival",
    youtube: "https://youtube.com/metalgatesfestival",
  });
  const [copyright, setCopyright] = useState("© 2024 Metal Gates Festival. All rights reserved.");
  const [location, setLocation] = useState("Quantic Club, Bucharest");

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const [siteAssetsData, infoPageData] = await Promise.all([
        getSiteAssets(),
        getInfoPage(),
      ]);
      
      const assets = siteAssetsData.assets;
      setContactEmails(assets?.contactEmails || []);
      if (assets?.facebook || assets?.instagram || assets?.youtube) {
        setSocialLinks({
          facebook: assets.facebook || "",
          instagram: assets.instagram || "",
          youtube: assets.youtube || "",
        });
      }
      if (assets?.copyright) {
        setCopyright(assets.copyright);
      }
      if (infoPageData?.location?.title) {
        setLocation(infoPageData.location.title);
      }
    } catch (error) {
      console.error("Footer: Error loading site assets:", error);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 glass border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Social Media */}
          <div className="flex items-center space-x-4">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href={socialLinks.youtube}
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
                <span>{location}</span>
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            {copyright}
          </div>
        </div>
      </div>
    </footer>
  )
}