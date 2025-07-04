import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  console.log('ProtectedRoute: Checking access - user:', user ? 'present' : 'null', 'loading:', loading, 'adminOnly:', adminOnly)

  if (loading) {
    console.log('ProtectedRoute: Still loading, showing loading spinner')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'admin') {
    console.log('ProtectedRoute: User is not admin, redirecting to home')
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute: Access granted, rendering children')
  return <>{children}</>
}