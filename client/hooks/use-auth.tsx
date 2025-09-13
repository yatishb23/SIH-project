"use client"

import { useState, useEffect, useContext, createContext, type ReactNode } from "react"
import { AuthState,getCurrentUser,login as authLogin,logout as authLogout,register as authRegister} from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (
    email: string,
    password: string,
    name: string,
    role?: "teacher" | "counselor",
  ) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for existing authentication on mount
    getCurrentUser().then((user) => {
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      })
    })
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const result = await authLogin(email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: result.error }
    }
  }

  const logout = async () => {
    await authLogout()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const register = async (email: string, password: string, name: string, role: "teacher" | "counselor" = "teacher") => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const result = await authRegister(email, password, name, role)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: result.error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
