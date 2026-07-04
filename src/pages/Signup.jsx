import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, UserPlus, Loader2, AlertCircle, Sprout, Info } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'
import { authErrorMessage } from '../auth/authErrors.js'
import GoogleIcon from '../components/GoogleIcon.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import FloatingInput from '../components/FloatingInput.jsx'
import TermsModal, { AgreeCheckbox } from '../components/TermsModal.jsx'

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [agreeWarn, setAgreeWarn] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  function warnIfNotAgreed() {
    if (!agreed) {
      setAgreeWarn(true)
      return true
    }
    return false
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (warnIfNotAgreed()) return
    setError('')

    if (password.length < 6) {
      setError('รหัสผ่านสั้นเกินไป (อย่างน้อย 6 ตัว)')
      return
    }
    if (password !== confirm) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/checker', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (warnIfNotAgreed()) return
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
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl border-gold-400/35 p-6 sm:p-9"
      >
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent"
          aria-hidden="true"
        />

        <div className="mb-7 flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, type: 'spring', bounce: 0.4 }}
            className="animate-pulse-glow flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-gold-200 ring-1 ring-gold-400/50"
          >
            <Sprout size={28} strokeWidth={2} aria-hidden="true" />
          </motion.span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            สมัครสมาชิก
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            สร้างบัญชีเพื่อใช้งานหน้าตรวจสอบอันตรกิริยา
          </p>
        </div>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-5 flex items-start gap-2.5 rounded-2xl border-l-4 border-risk-high bg-risk-highBg p-3.5 text-sm font-medium text-risk-high"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            id="email"
            label="อีเมล"
            icon={Mail}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingInput
            id="password"
            label="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FloatingInput
            id="confirm"
            label="ยืนยันรหัสผ่าน"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {/* Terms agreement */}
          <div className="pt-1">
            <AgreeCheckbox
              checked={agreed}
              onChange={(v) => {
                setAgreed(v)
                if (v) setAgreeWarn(false)
              }}
            >
              ฉันได้อ่านและยอมรับ{' '}
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="font-semibold text-gold-600 underline decoration-gold-400/60 underline-offset-2 transition-colors hover:text-gold-500"
              >
                ข้อตกลงการใช้งานและข้อจำกัดความรับผิดชอบ
              </button>
            </AgreeCheckbox>

            <AnimatePresence>
              {agreeWarn && !agreed ? (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mt-2 flex items-center gap-1.5 overflow-hidden pl-1 text-xs font-medium text-risk-medium"
                >
                  <Info size={13} className="shrink-0" aria-hidden="true" />
                  กรุณายอมรับข้อตกลงการใช้งานก่อนสมัครสมาชิก
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <span onClick={warnIfNotAgreed} className="block">
            <motion.button
              type="submit"
              disabled={loading || !agreed}
              whileHover={loading || !agreed ? undefined : { scale: 1.02 }}
              whileTap={loading || !agreed ? undefined : { scale: 0.97 }}
              className="btn-primary w-full disabled:pointer-events-none disabled:opacity-45"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <UserPlus size={18} aria-hidden="true" />
              )}
              สมัครสมาชิก
            </motion.button>
          </span>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-300/60" />
          หรือ
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-300/60" />
        </div>

        <span onClick={warnIfNotAgreed} className="block">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading || !agreed}
            className="btn-secondary w-full disabled:pointer-events-none disabled:opacity-45"
          >
            <GoogleIcon size={18} />
            สมัคร / เข้าสู่ระบบด้วย Google
          </button>
        </span>

        <p className="mt-7 text-center text-sm text-ink-soft">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="font-semibold text-brand-700 transition-colors hover:text-gold-600">
            เข้าสู่ระบบ
          </Link>
        </p>
      </motion.div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </AuthLayout>
  )
}
