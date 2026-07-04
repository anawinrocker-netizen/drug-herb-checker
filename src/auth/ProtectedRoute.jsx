import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext.jsx'

// Guards routes that require a signed-in user. While auth state is still being
// resolved a short spinner is shown; unauthenticated users are sent to /login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-ink-soft">
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          กำลังตรวจสอบสถานะการเข้าสู่ระบบ...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
