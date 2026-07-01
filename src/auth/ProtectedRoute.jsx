import { useAuth } from './AuthContext.jsx'

// Placeholder protected route. Right now it lets everyone through so the app
// is fully usable without login. When auth is enabled, uncomment the redirect
// logic below to require a signed-in user.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Pass-through for now.
  void user
  void loading

  // Future behaviour (enable when auth is ready):
  // if (loading) return <LoadingScreen />
  // if (!user) return <Navigate to="/login" replace />

  return children
}
