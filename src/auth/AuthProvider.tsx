import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type User = { id?: number | string; email?: string; name?: string }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'auth:token'

function base64url(input: string) {
  return btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function createFakeJWT(payload: object) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const p = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const token = `${base64url(JSON.stringify(header))}.${base64url(p)}.${base64url('signature')}`
  return token
}

function decodeJWT(token: string | null): any {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload)
  } catch (e) {
    return null
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(() => decodeJWT(localStorage.getItem(TOKEN_KEY)) || null)

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  async function login(email: string, password: string) {
    try {
      const res = await axios.post('http://localhost:3000/login', { email, password })
      // json-server-auth may return accessToken or token
      const t = res.data?.accessToken || res.data?.token || null
      if (t) {
        setToken(t)
        setUser(decodeJWT(t))
        return
      }
    } catch (e) {
      // fallback to fake token
    }

    // fallback: create fake token
    const fake = createFakeJWT({ email, name: email.split('@')[0], id: Date.now() })
    setToken(fake)
    setUser(decodeJWT(fake))
  }

  async function register(name: string, email: string, password: string) {
    try {
      await axios.post('http://localhost:3000/register', { name, email, password })
      // optionally login after register
      await login(email, password)
      return
    } catch (e) {
      // fallback: just login with fake token
      const fake = createFakeJWT({ email, name, id: Date.now() })
      setToken(fake)
      setUser(decodeJWT(fake))
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
