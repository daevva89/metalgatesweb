import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { HelmetProvider } from "react-helmet-async"
import { Login } from "./pages/Login"
// import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { Home } from "./pages/Home"
import { Lineup } from "./pages/Lineup"
import { News } from "./pages/News"
import { NewsArticle } from "./pages/NewsArticle"
import { Info } from "./pages/Info"
import { Archive } from "./pages/Archive"
import { Contact } from "./pages/Contact"
import { ComingSoon } from "./pages/ComingSoon"
import { NotFoundPage } from "./pages/NotFoundPage"
import { AdminLayout } from "./components/admin/AdminLayout"
import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { AdminLineup } from "./pages/admin/AdminLineup"
import { AdminNews } from "./pages/admin/AdminNews"
import { AdminPages } from "./pages/admin/AdminPages"
import { AdminArchive } from "./pages/admin/AdminArchive"
import { AdminSettings } from "./pages/admin/AdminSettings"
import { useState, useEffect } from "react"
import { getFestivalInfo, logVisit, getSiteAssets } from "./api/festival"

// Extend Window interface for Google Tag Manager
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: any[]) => void;
  }
}

function App() {
  const [festivalActive, setFestivalActive] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkFestivalStatus()
  }, [])

  useEffect(() => {
    const initializeTracking = async () => {
      try {
        // Check if GTM is already loaded (server-side injection in production)
        const existingGTMScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
        if (existingGTMScript) {
          console.log('GTM already loaded via server-side injection');
          return;
        }

        const data = await getSiteAssets();
        const assets = data.assets;

        // Only initialize GTM if we have a GTM ID from database
        if (assets.gtmId && assets.gtmId.trim() !== '') {
          // Initialize dataLayer first
          window.dataLayer = window.dataLayer || [];
          
          // GTM initialization function
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });

          // Dynamically load GTM script
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtm.js?id=${assets.gtmId}`;
          
          // Insert script in head
          const firstScript = document.getElementsByTagName('script')[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
          } else {
            document.head.appendChild(script);
          }

          // Add noscript fallback for GTM
          const noscript = document.createElement('noscript');
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.googletagmanager.com/ns.html?id=${assets.gtmId}`;
          iframe.height = '0';
          iframe.width = '0';
          iframe.style.display = 'none';
          iframe.style.visibility = 'hidden';
          noscript.appendChild(iframe);
          document.body.insertBefore(noscript, document.body.firstChild);

          console.log('GTM loaded dynamically with ID:', assets.gtmId);
        } else {
          console.log('No GTM ID found in database - tracking not initialized');
        }

      } catch (error) {
        console.error('Failed to initialize tracking:', error);
        // Silent fail - tracking initialization failed
      }
    };

    initializeTracking();
    logVisit();
  }, []);

  const checkFestivalStatus = async () => {
    try {
      await getFestivalInfo()
      // The festival info will be returned if there's an active festival
      setFestivalActive(true)
    } catch {
      // If no active festival found, show coming soon page
      setFestivalActive(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // If festival is not active, show coming soon page for all public routes
  if (!festivalActive) {
    return (
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/register" element={<Register />} /> */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="lineup" element={<AdminLineup />} />
                  <Route path="news" element={<AdminNews />} />
                  <Route path="pages" element={<AdminPages />} />
                  <Route path="archive" element={<AdminArchive />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<ComingSoon />} />
              </Routes>
            </Router>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    )
  }

  return (
  <HelmetProvider>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="lineup" element={<Lineup />} />
              <Route path="news" element={<News />} />
              <Route path="news/:id" element={<NewsArticle />} />
              <Route path="info" element={<Info />} />
              <Route path="archive" element={<Archive />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="lineup" element={<AdminLineup />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="archive" element={<AdminArchive />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  </HelmetProvider>
  )
}

export default App