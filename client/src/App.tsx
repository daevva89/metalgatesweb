import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { BlankPage } from "./pages/BlankPage"
import { Home } from "./pages/Home"
import { Lineup } from "./pages/Lineup"
import { News } from "./pages/News"
import { NewsArticle } from "./pages/NewsArticle"
import { Info } from "./pages/Info"
import { Archive } from "./pages/Archive"
import { Contact } from "./pages/Contact"
import { ComingSoon } from "./pages/ComingSoon"
import { AdminLayout } from "./components/admin/AdminLayout"
import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { AdminLineup } from "./pages/admin/AdminLineup"
import { AdminNews } from "./pages/admin/AdminNews"
import { AdminPages } from "./pages/admin/AdminPages"
import { AdminArchive } from "./pages/admin/AdminArchive"
import { AdminSettings } from "./pages/admin/AdminSettings"
import { useState, useEffect } from "react"
import { getFestivalInfo, logVisit } from "./api/festival"

function App() {
  const [festivalActive, setFestivalActive] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkFestivalStatus()
  }, [])

  useEffect(() => {
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
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
    )
  }

  return (
  <AuthProvider>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  </AuthProvider>
  )
}

export default App