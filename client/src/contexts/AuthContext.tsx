import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { loginUser, registerUser, getCurrentUser, logoutUser } from '@/api/auth'
import { useToast } from '@/hooks/useToast'

interface User {
  _id: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      
      if (accessToken) {
        try {
          const userData = await getCurrentUser()
          setUser(userData.user)
        } catch (error) {
          console.error('AuthContext: Failed to get current user:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
      
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password)
      setUser(response.user)
      toast({
        title: "Success",
        description: "Logged in successfully"
      })
    } catch (error) {
      console.error('AuthContext: Login failed:', error)
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      })
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await registerUser(email, password)
      setUser(response.user)
      toast({
        title: "Success",
        description: "Account created successfully"
      })
    } catch (error) {
      console.error('AuthContext: Registration failed:', error)
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      })
      throw error
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}