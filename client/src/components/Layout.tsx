import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"

export function Layout() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}