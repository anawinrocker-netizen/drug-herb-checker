import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// Hand-drawn SVG leaves (no emoji): slender leaf, round leaf, herb sprig.
function LeafSvg({ variant, size, className }) {
  if (variant === 0) {
    // Slender pointed leaf with center vein
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 1.5C8.2 6.2 6.8 11 7.6 15.4c.6 3.2 2.3 5.8 4.4 7.1 2.1-1.3 3.8-3.9 4.4-7.1.8-4.4-.6-9.2-4.4-13.9Z" />
        <path d="M12 4v16" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none" />
      </svg>
    )
  }
  if (variant === 1) {
    // Rounded leaf, tilted, with vein
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M20.5 3.5C12 3 5.5 6.5 4 12.5c-1 4 1.5 7.5 5.5 8 6 .8 10.7-5.2 11-17Z" />
        <path d="M18 6C13 9 9.5 13 7.5 18" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none" />
      </svg>
    )
  }
  // Herb sprig: stem with paired leaflets
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 22V3" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M12 6c-2.8-.4-4.6-2-5.2-4.5C9.6 1.6 11.5 3.2 12 6Z" />
      <path d="M12 6c2.8-.4 4.6-2 5.2-4.5C14.4 1.6 12.5 3.2 12 6Z" />
      <path d="M12 11c-3-.4-5-2.1-5.6-4.8C9.4 6.3 11.4 8 12 11Z" />
      <path d="M12 11c3-.4 5-2.1 5.6-4.8C14.6 6.3 12.6 8 12 11Z" />
      <path d="M12 16.5c-3.2-.5-5.3-2.3-6-5.2 3.2.2 5.4 2 6 5.2Z" />
      <path d="M12 16.5c3.2-.5 5.3-2.3 6-5.2-3.2.2-5.4 2-6 5.2Z" />
    </svg>
  )
}

const TONES = ['text-brand-400', 'text-brand-600', 'text-sage', 'text-gold-400']

// Full-screen (or container-scoped) layer of slowly falling, swaying leaves.
// Pure transform/opacity CSS animations; halved density on mobile; removed
// entirely when the user prefers reduced motion.
export default function FloatingLeaves({ density = 14, fixed = true, behind = true, className = '' }) {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const count = isMobile ? Math.ceil(density / 2) : density

  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 18,
        duration: 18 + Math.random() * 20,
        delay: -Math.random() * 36, // negative → already mid-fall on load
        drift: (Math.random() * 2 - 1) * 130,
        spin: (Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 240),
        sway: 4.5 + Math.random() * 4,
        variant: i % 3,
        opacity: 0.18 + Math.random() * 0.2,
        tone: TONES[Math.floor(Math.random() * TONES.length)],
      })),
    [count]
  )

  if (reduceMotion) return null

  return (
    <div
      className={`pointer-events-none ${fixed ? 'fixed' : 'absolute'} inset-0 ${behind ? '-z-10' : 'z-0'} overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {leaves.map((l) => (
        <span
          key={l.id}
          className="leaf-fall absolute top-0"
          style={{
            left: `${l.left}%`,
            opacity: l.opacity,
            '--drift': `${l.drift}px`,
            '--spin': `${l.spin}deg`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
          }}
        >
          <span className="leaf-sway block" style={{ animationDuration: `${l.sway}s` }}>
            <LeafSvg variant={l.variant} size={l.size} className={l.tone} />
          </span>
        </span>
      ))}
    </div>
  )
}

// Rising glow particles (forest spores) — scoped to a positioned parent.
export function GlowParticles({ count = 12, className = '' }) {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const n = isMobile ? Math.ceil(count / 2) : count

  const particles = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        id: i,
        left: 4 + Math.random() * 92,
        size: 2.5 + Math.random() * 4,
        duration: 9 + Math.random() * 10,
        delay: -Math.random() * 18,
        sway: (Math.random() * 2 - 1) * 40,
        pop: 0.35 + Math.random() * 0.4,
        gold: Math.random() > 0.6,
      })),
    [n]
  )

  if (reduceMotion) return null

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-rise absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            '--sway': `${p.sway}px`,
            '--pop': p.pop,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            background: p.gold ? 'rgba(220, 201, 147, 0.9)' : 'rgba(167, 243, 208, 0.9)',
            boxShadow: p.gold
              ? '0 0 10px 2px rgba(201, 169, 97, 0.5)'
              : '0 0 10px 2px rgba(110, 231, 183, 0.45)',
          }}
        />
      ))}
    </div>
  )
}
