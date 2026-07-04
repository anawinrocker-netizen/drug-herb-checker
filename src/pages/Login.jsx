import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Loader2, AlertCircle, ShieldPlus } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'
import { authErrorMessage } from '../auth/authErrors.js'
import GoogleIcon from '../components/GoogleIcon.jsx'

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/checker', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate('/checker', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="card-surface p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-soft">
            <ShieldPlus size={24} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">เข้าสู่ระบบ</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            เข้าสู่ระบบเพื่อใช้งานหน้าตรวจสอบอันตรกิริยา
          </p>
        </div>

        {error ? (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border-l-4 border-risk-high bg-risk-highBg p-3.5 text-sm font-medium text-risk-high">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
              อีเมล
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-brand-200 bg-white px-3.5 py-2.5 shadow-soft transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-300">
              <Mail size={18} className="shrink-0 text-ink-soft" aria-hidden="true" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
              รหัสผ่าน
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-brand-200 bg-white px-3.5 py-2.5 shadow-soft transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-300">
              <Lock size={18} className="shrink-0 text-ink-soft" aria-hidden="true" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.02 }}
            whileTap={loading ? undefined : { scale: 0.98 }}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <LogIn size={18} aria-hidden="true" />
            )}
            เข้าสู่ระบบ
          </motion.button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
          <span className="h-px flex-1 bg-brand-100" />
          หรือ
          <span className="h-px flex-1 bg-brand-100" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon size={18} />
          เข้าสู่ระบบด้วย Google
        </button>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ยังไม่มีบัญชี?{' '}
          <Link to="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
            สมัครสมาชิก
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
