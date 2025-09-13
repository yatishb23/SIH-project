export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "counselor"
  createdAt: Date
  lastLogin?: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock user database (replace with real database later)
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@school.edu",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "teacher@school.edu",
    name: "Jane Teacher",
    role: "teacher",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
  },
]

// Cookie management utilities
export const AUTH_COOKIE_NAME = "student-dashboard-auth"
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; secure; samesite=strict`
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

export function deleteCookie(name: string) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
}

// Authentication functions
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock authentication logic
  const user = mockUsers.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  // In real implementation, verify password hash
  if (password !== "password123") {
    return { success: false, error: "Invalid password" }
  }

  // Update last login
  user.lastLogin = new Date()

  // Set authentication cookie
  const authToken = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
  setCookie(AUTH_COOKIE_NAME, authToken)

  return { success: true, user }
}

export async function logout(): Promise<void> {
  deleteCookie(AUTH_COOKIE_NAME)
}

export async function getCurrentUser(): Promise<User | null> {
  const authToken = getCookie(AUTH_COOKIE_NAME)

  if (!authToken) {
    return null
  }

  try {
    const { userId } = JSON.parse(atob(authToken))
    const user = mockUsers.find((u) => u.id === userId)
    return user || null
  } catch {
    // Invalid token
    deleteCookie(AUTH_COOKIE_NAME)
    return null
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: "teacher" | "counselor" = "teacher",
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    return { success: false, error: "User already exists" }
  }

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email,
    name,
    role,
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  mockUsers.push(newUser)

  // Set authentication cookie
  const authToken = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }))
  setCookie(AUTH_COOKIE_NAME, authToken)

  return { success: true, user: newUser }
}
