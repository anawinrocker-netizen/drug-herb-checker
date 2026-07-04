import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import {
  ArrowRight,
  Search,
  Layers,
  ShieldCheck,
  BookOpenCheck,
  Leaf,
  Pill,
} from 'lucide-react'
import WaveDivider from '../components/WaveDivider.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import { GlowParticles } from '../components/FloatingLeaves.jsx'
import interactions from '../data/interactions.json'
import drugs from '../data/drugs.json'
import herbs from '../data/herbs.json'

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const FEATURES = [
  {
    icon: Layers,
    title: 'ตรวจหลายคู่พร้อมกัน',
    desc: 'ใส่ยาและสมุนไพรได้หลายชนิด ระบบจับคู่ยาทุกตัวกับสมุนไพรทุกตัวและแสดงผลทุกคู่ในครั้งเดียว',
  },
  {
    icon: ShieldCheck,
    title: 'แยกระดับความเสี่ยงชัดเจน',
    desc: 'จัดระดับเป็น สูง / กลาง / ต่ำ / ไม่ทราบ พร้อมสีและไอคอนกำกับ เรียงคู่เสี่ยงสูงขึ้นก่อนเสมอ',
  },
  {
    icon: BookOpenCheck,
    title: 'อ้างอิงระดับหลักฐาน',
    desc: 'ระบุว่ามีหลักฐานชัดเจน ขัดแย้ง หรือเชิงทฤษฎี เพื่อป้องกันทั้งการตื่นตระหนกและการชะล่าใจ',
  },
]

const STATS = [
  { value: interactions.length, label: 'คู่ปฏิกิริยา' },
  { value: drugs.length, label: 'รายการยา' },
  { value: herbs.length, label: 'สมุนไพร/อาหารเสริม' },
]

const STEPS = [
  { icon: Pill, text: 'เลือกยาหัวใจที่กินอยู่ (ค้นได้ทั้งชื่อไทยและอังกฤษ)' },
  { icon: Leaf, text: 'เลือกสมุนไพรหรืออาหารเสริมที่ต้องการจะกิน' },
  { icon: Search, text: 'กดตรวจสอบ แล้วอ่านผลทุกคู่ที่เรียงตามความเสี่ยง' },
]

// Hand-drawn leaf with gold center vein — used in the hero composition (no emoji).
function LeafShape({ size = 120, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 1.5C8.2 6.2 6.8 11 7.6 15.4c.6 3.2 2.3 5.8 4.4 7.1 2.1-1.3 3.8-3.9 4.4-7.1.8-4.4-.6-9.2-4.4-13.9Z" />
      <path d="M12 4v16" stroke="rgba(201,169,97,0.55)" strokeWidth="0.7" fill="none" />
      <path
        d="M12 9c1.3-1 2.2-2.3 2.8-3.9M12 13c1.5-1 2.6-2.5 3.2-4.4M12 9c-1.3-1-2.2-2.3-2.8-3.9M12 13c-1.5-1-2.6-2.5-3.2-4.4"
        stroke="rgba(201,169,97,0.4)"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  )
}

// Number that counts up from 0 when it scrolls into view.
function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>{display}</span>
}

export default function Home() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)

  // Mouse parallax for hero decorative layers (transform-only, spring-smoothed)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 14 })
  const sy = useSpring(my, { stiffness: 40, damping: 14 })
  const blobX1 = useTransform(sx, (v) => v * 26)
  const blobY1 = useTransform(sy, (v) => v * 20)
  const blobX2 = useTransform(sx, (v) => v * -34)
  const blobY2 = useTransform(sy, (v) => v * -24)
  const leafX = useTransform(sx, (v) => v * 14)
  const leafY = useTransform(sy, (v) => v * 10)
  const botanicalMX = useTransform(sx, (v) => v * 18)
  const botanicalMY = useTransform(sy, (v) => v * 14)

  // Scroll parallax scoped to the hero (progress 0→1 as the hero scrolls out).
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroLeavesY = useTransform(heroProgress, [0, 1], [0, -90])
  const botanicalScrollY = useTransform(heroProgress, [0, 1], [0, -70])
  const ringRotate = useTransform(heroProgress, [0, 1], [0, 70])
  const orbScale = useTransform(heroProgress, [0, 1], [1, 1.18])

  // Page-level scroll for the ambient background deepen + slow rotating leaves.
  const { scrollYProgress } = useScroll()
  const deepen = useTransform(scrollYProgress, [0, 0.55], [0, 0.55])
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 130])
  const bgRotate2 = useTransform(scrollYProgress, [0, 1], [0, -110])

  function onHeroMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  // Helper: only bind scroll-linked motion styles when motion is allowed.
  const s = (style) => (reduce ? undefined : style)

  return (
    <div className="relative">
      {/* Ambient background that deepens green as you scroll down the page */}
      <motion.div
        aria-hidden="true"
        style={s({ opacity: deepen })}
        className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-transparent via-brand-100/0 to-brand-900/12"
      />

      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        className="hero-gradient relative overflow-hidden text-white"
      >
        {/* dotted texture */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        {/* parallax blurred blobs — green + gold */}
        <motion.div
          style={{ x: blobX1, y: blobY1 }}
          className="animate-blob-drift pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-400/25 blur-3xl"
          aria-hidden="true"
        />
        <motion.div
          style={{ x: blobX2, y: blobY2 }}
          className="animate-blob-drift pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl [animation-delay:-5s]"
          aria-hidden="true"
        />
        <motion.div
          style={{ x: blobX1, y: blobY2 }}
          className="animate-blob-drift pointer-events-none absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl [animation-delay:-10s]"
          aria-hidden="true"
        />

        {/* rising forest spores */}
        <GlowParticles count={16} />

        {/* parallax decorative leaves (mouse + scroll) */}
        <motion.div
          style={s({ y: heroLeavesY })}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <motion.div style={{ x: leafX, y: leafY }} className="absolute inset-0">
            <Leaf size={130} className="absolute -left-6 top-24 rotate-[30deg] text-white/[0.05]" />
            <Leaf size={90} className="absolute right-14 top-14 -rotate-[20deg] text-gold-300/10" />
            <Leaf size={110} className="absolute bottom-28 left-1/4 rotate-[100deg] text-white/[0.05]" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:gap-6"
        >
          {/* Left: copy, weighted to the start edge */}
          <div className="text-left lg:col-span-7">
            <motion.span
              variants={heroItem}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-50 ring-1 ring-gold-400/40 backdrop-blur-sm"
            >
              <ShieldCheck size={15} className="text-gold-300" aria-hidden="true" />
              เครื่องมือคัดกรองสำหรับผู้ป่วยโรคหัวใจ
            </motion.span>

            {/* Typographic hierarchy: emphasize "อันตรกิริยา" in gold */}
            <h1 className="mt-6 font-bold leading-[1.05] tracking-tight">
              <motion.span
                variants={heroItem}
                className="block text-2xl font-medium text-brand-50/85 sm:text-3xl"
              >
                ระบบคัดกรอง
              </motion.span>
              <motion.span
                variants={heroItem}
                className="text-gold-luxe mt-1 block text-5xl font-extrabold sm:text-6xl lg:text-7xl"
              >
                อันตรกิริยา
              </motion.span>
              <motion.span
                variants={heroItem}
                className="mt-1 block text-3xl font-semibold text-white sm:text-4xl"
              >
                ระหว่าง<span className="text-gold-200">ยา</span>และ
                <span className="text-gold-200">สมุนไพร</span>
              </motion.span>
            </h1>

            <motion.p
              variants={heroItem}
              className="mt-6 max-w-xl text-base leading-relaxed text-brand-50/90 sm:text-lg"
            >
              ตรวจสอบเบื้องต้นว่ายาหัวใจที่คุณใช้อยู่กับสมุนไพรหรืออาหารเสริมที่จะกิน
              มีความเสี่ยงเกิดปฏิกิริยาต่อกันหรือไม่ พร้อมระดับหลักฐานและคำแนะนำ
            </motion.p>

            <motion.div variants={heroItem} className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/checker">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="animate-pulse-glow inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-lift ring-1 ring-gold-400/50 transition-colors hover:bg-gold-50"
                >
                  <Search size={18} aria-hidden="true" />
                  เริ่มตรวจสอบ
                  <ArrowRight size={18} aria-hidden="true" />
                </motion.span>
              </Link>
              <Link to="/interactions">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-brand-50/90 ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  ดูคู่ที่ไม่ควรใช้ร่วม
                  <ArrowRight size={16} aria-hidden="true" />
                </motion.span>
              </Link>
            </motion.div>

            {/* stats — horizontal strip with gold dividers + count-up */}
            <motion.div
              variants={heroItem}
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-x-8"
            >
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6 sm:gap-8">
                  <div>
                    <div className="font-display text-3xl font-bold text-gold-200 sm:text-4xl">
                      <CountUp value={stat.value} />
                    </div>
                    <div className="mt-1 text-xs text-brand-50/75 sm:text-sm">{stat.label}</div>
                  </div>
                  {i < STATS.length - 1 ? (
                    <span
                      className="hidden h-11 w-px bg-gradient-to-b from-transparent via-gold-400/50 to-transparent sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: layered botanical composition */}
          <motion.div
            variants={heroItem}
            className="hidden justify-center sm:flex lg:col-span-5"
          >
            <motion.div
              style={s({ y: botanicalScrollY })}
              className="relative aspect-square w-full max-w-[22rem] lg:max-w-md"
            >
              {/* soft orb */}
              <motion.div
                style={s({ scale: orbScale })}
                className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-400/25 via-emerald-300/10 to-gold-400/15 blur-2xl"
                aria-hidden="true"
              />
              {/* rotating dashed gold ring */}
              <motion.svg
                viewBox="0 0 200 200"
                style={s({ rotate: ringRotate })}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(201,169,97,0.35)"
                  strokeWidth="1"
                  strokeDasharray="2 10"
                  strokeLinecap="round"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
              </motion.svg>

              {/* leaf cluster — parallaxed by the mouse */}
              <motion.div
                style={{ x: botanicalMX, y: botanicalMY }}
                className="absolute inset-0"
                aria-hidden="true"
              >
                <LeafShape
                  size={150}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] text-brand-200/90 drop-shadow-[0_10px_30px_rgba(11,61,38,0.45)]"
                />
                <LeafShape
                  size={120}
                  className="absolute left-[26%] top-[52%] -rotate-[52deg] text-brand-300/80"
                />
                <LeafShape
                  size={128}
                  className="absolute right-[22%] top-[52%] rotate-[52deg] text-emerald-200/80"
                />
                <LeafShape
                  size={88}
                  className="absolute left-[34%] bottom-[12%] -rotate-[18deg] text-gold-200/75"
                />
                <LeafShape
                  size={92}
                  className="absolute right-[30%] bottom-[10%] rotate-[22deg] text-brand-100/80"
                />
                {/* central stem */}
                <span className="absolute left-1/2 top-[54%] h-[30%] w-px -translate-x-1/2 bg-gradient-to-b from-gold-200/70 to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <WaveDivider color="#FAFDF9" />
      </section>

      {/* Features — bento grid (unequal, staggered reveal) */}
      <section className="relative overflow-hidden">
        {/* slow scroll-linked decorative leaf */}
        <motion.div
          aria-hidden="true"
          style={s({ rotate: bgRotate })}
          className="pointer-events-none absolute -right-24 top-4 opacity-60"
        >
          <LeafShape size={300} className="text-brand-100/60" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <h2 className="text-luxe text-2xl font-bold tracking-tight sm:text-3xl">
              จุดเด่นของระบบ
            </h2>
            <p className="mt-3 text-ink-soft">
              ออกแบบให้อ่านง่ายและตัดสินใจได้เร็ว บนพื้นฐานข้อมูลที่ระบุระดับหลักฐาน
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 md:auto-rows-fr md:grid-cols-3">
            {FEATURES.map((f, i) => {
              const lead = i === 0
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className={`card-surface group relative overflow-hidden p-6 ${
                    lead
                      ? 'flex flex-col justify-between bg-gradient-to-br from-white to-brand-50/60 md:row-span-2 md:p-8'
                      : 'md:col-span-2'
                  }`}
                >
                  {/* faint index number behind */}
                  <span
                    className={`pointer-events-none absolute -right-2 -top-4 select-none font-display font-extrabold leading-none text-brand-100/70 ${
                      lead ? 'text-[9rem]' : 'text-[6rem]'
                    }`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>

                  <div className="relative">
                    <span
                      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 text-brand-700 ring-1 ring-gold-300/50 transition-transform duration-300 group-hover:scale-110 ${
                        lead ? 'h-16 w-16' : 'h-12 w-12'
                      }`}
                    >
                      <f.icon size={lead ? 30 : 24} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3
                      className={`mt-4 font-semibold text-ink ${lead ? 'text-xl' : 'text-lg'}`}
                    >
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works — timeline with self-drawing connector */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 to-gold-50/40">
        <motion.div
          aria-hidden="true"
          style={s({ rotate: bgRotate2 })}
          className="pointer-events-none absolute -left-20 bottom-0 opacity-50"
        >
          <LeafShape size={240} className="text-gold-200/50" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                ใช้งานง่ายใน <span className="text-luxe">3 ขั้นตอน</span>
              </h2>

              <ol className="relative mt-8 space-y-7">
                {/* connecting line that draws itself on scroll-in */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="absolute bottom-7 left-7 top-7 w-[2px] -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-brand-400 via-brand-500 to-gold-400"
                />
                {STEPS.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.15 }}
                    className="relative flex items-start gap-5"
                  >
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft ring-1 ring-gold-300/50">
                      <step.icon size={22} aria-hidden="true" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 font-display text-xs font-bold text-gold-100 ring-2 ring-white">
                        {i + 1}
                      </span>
                    </div>
                    <p className="pt-3.5 leading-relaxed text-ink">{step.text}</p>
                  </motion.li>
                ))}
              </ol>

              <Link to="/checker" className="btn-primary mt-8">
                <Search size={18} aria-hidden="true" />
                ไปที่หน้าตรวจสอบ
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Disclaimer />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
