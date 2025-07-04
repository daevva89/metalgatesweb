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
    console.log('AuthContext: useEffect triggered, checking for existing authentication')
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      console.log('AuthContext: Access token from localStorage:', accessToken ? 'present' : 'missing')
      
      if (accessToken) {
        try {
          console.log('AuthContext: Attempting to get current user profile')
          const userData = await getCurrentUser()
          console.log('AuthContext: Successfully retrieved user data:', userData)
          setUser(userData.user)
        } catch (error) {
          console.error('AuthContext: Failed to get current user:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      } else {
        console.log('AuthContext: No access token found, user not authenticated')
      }
      
      console.log('AuthContext: Setting loading to false')
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    console.log('AuthContext: Login attempt for email:', email)
    try {
      const response = await loginUser(email, password)
      console.log('AuthContext: Login successful, setting user data')
      setUser(response.user)
      toast({
        title: "Success",
        description: "Logged in successfully"
      })
    } catch (error) {
      console.error('AuthContext: Login failed:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    console.log('AuthContext: Register attempt for email:', email)
    try {
      const response = await registerUser(email, password)
      console.log('AuthContext: Registration successful, setting user data')
      setUser(response.user)
      toast({
        title: "Success",
        description: "Account created successfully"
      })
    } catch (error) {
      console.error('AuthContext: Registration failed:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const logout = () => {
    console.log('AuthContext: Logout initiated')
    logoutUser()
    setUser(null)
    console.log('AuthContext: User state cleared')
  }

  console.log('AuthContext: Rendering with user:', user ? 'authenticated' : 'not authenticated', 'loading:', loading)

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