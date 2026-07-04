import { motion } from 'framer-motion'
import { Leaf, HeartPulse, ShieldCheck, Sprout } from 'lucide-react'
import FloatingLeaves, { GlowParticles } from './FloatingLeaves.jsx'

const POINTS = [
  { icon: HeartPulse, text: 'ออกแบบเฉพาะสำหรับผู้ป่วยโรคหัวใจ' },
  { icon: Leaf, text: 'ครอบคลุมสมุนไพรและอาหารเสริมยอดนิยม' },
  { icon: ShieldCheck, text: 'แยกระดับความเสี่ยงชัดเจน พร้อมคำแนะนำ' },
]

// Two-pane premium auth shell: left = deep-emerald herbal ambience with
// falling leaves + glowing spores, right = frosted-glass form card.
export default function AuthLayout({ children }) {
  return (
    <div className="relative grid min-h-[calc(100vh-8rem)] lg:grid-cols-2">
      {/* Left ambience panel (desktop only) */}
      <div className="hero-gradient relative hidden overflow-hidden lg:block">
        <div className="dot-grid absolute inset-0 opacity-25" aria-hidden="true" />
        {/* drifting blurred blobs */}
        <div
          className="animate-blob-drift absolute -left-20 top-16 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="animate-blob-drift absolute bottom-10 right-0 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl [animation-delay:-6s]"
          aria-hidden="true"
        />
        <FloatingLeaves fixed={false} behind={false} density={10} className="opacity-90" />
        <GlowParticles count={14} />

        <div className="relative z-10 flex h-full flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="animate-pulse-glow inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-gold-300 ring-1 ring-gold-400/50 backdrop-blur-sm">
              <Sprout size={32} strokeWidth={1.8} aria-hidden="true" />
            </span>

            <h2 className="mt-8 text-3xl font-bold leading-snug text-white xl:text-4xl">
              ธรรมชาติปลอดภัยขึ้น
              <br />
              <span className="text-gold-luxe">เมื่อรู้ว่าอะไรใช้ร่วมกันได้</span>
            </h2>

            <p className="mt-4 max-w-md leading-relaxed text-brand-100/90">
              ระบบคัดกรองอันตรกิริยาระหว่างยาหัวใจและสมุนไพร
              เพื่อให้คุณดูแลสุขภาพด้วยสมุนไพรได้อย่างมั่นใจ
            </p>

            <ul className="mt-10 space-y-4">
              {POINTS.map((p, i) => (
                <motion.li
                  key={p.text}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.12 }}
                  className="flex items-center gap-3 text-sm text-brand-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold-300 ring-1 ring-white/20">
                    <p.icon size={17} aria-hidden="true" />
                  </span>
                  {p.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right form pane */}
      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <FloatingLeaves fixed={false} behind={false} density={8} className="lg:hidden" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
