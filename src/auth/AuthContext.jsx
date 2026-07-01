import { createContext, useContext, useMemo } from 'react'

// Placeholder auth context. Currently returns no authenticated user.
// When real auth (e.g. Firebase) is added later, wire it up here without
// changing the rest of the app: replace the value with real state/effects.
const AuthContext = createContext({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  // TODO: replace with real auth state when authentication is implemented.
  const value = useMemo(
    () => ({
      user: null,
      loading: false,
      signIn: async () => {},
      signOut: async () => {},
    }),
    []
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
