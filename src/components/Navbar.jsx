import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldPlus, Menu, X, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'หน้าหลัก', end: true },
  { to: '/checker', label: 'ตรวจสอบ' },
  { to: '/interactions', label: 'คู่ที่ไม่ควรใช้ร่วม' },
  { to: '/help', label: 'วิธีใช้ / FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setOpen(false)
    await logOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 rounded-xl" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-soft">
            <ShieldPlus size={20} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-ink sm:text-base">
              ระบบคัดกรองยา-สมุนไพร
            </span>
            <span className="text-[11px] text-ink-soft">สำหรับผู้ป่วยโรคหัวใจ</span>
          </span>
        </Link>

        {/* Desktop menu + auth */}
        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-soft hover:bg-brand-50/60 hover:text-brand-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative">
                      {item.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-600"
                        />
                      ) : null}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <span className="mx-1 h-6 w-px bg-brand-100" aria-hidden="true" />

          {user ? (
            <div className="flex items-center gap-2">
              <span
                className="flex max-w-[12rem] items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800"
                title={user.email || 'ผู้ใช้'}
              >
                <User size={15} aria-hidden="true" />
                <span className="truncate">{user.email || 'ผู้ใช้'}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                <LogOut size={15} aria-hidden="true" />
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-800"
            >
              <LogIn size={15} aria-hidden="true" />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft hover:bg-brand-50 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-brand-100 bg-white/95 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-ink-soft hover:bg-brand-50/60'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              <li className="mt-1 border-t border-brand-100 pt-2">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-800">
                      <User size={16} aria-hidden="true" />
                      <span className="truncate">{user.email || 'ผู้ใช้'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50/60 hover:text-brand-700"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      ออกจากระบบ
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50/60"
                  >
                    <LogIn size={16} aria-hidden="true" />
                    เข้าสู่ระบบ
                  </NavLink>
                )}
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
