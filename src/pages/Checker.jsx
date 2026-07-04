import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Pill, Leaf, Search, AlertTriangle, ClipboardList, Loader2, RotateCcw } from 'lucide-react'
import drugs from '../data/drugs.json'
import herbs from '../data/herbs.json'
import { matchAll } from '../lib/interactions.js'
import MultiSelectInput from '../components/MultiSelectInput.jsx'
import InteractionCard from '../components/InteractionCard.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

// Hand-drawn leaf with gold vein (no emoji) — faint background accents.
function LeafShape({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1.5C8.2 6.2 6.8 11 7.6 15.4c.6 3.2 2.3 5.8 4.4 7.1 2.1-1.3 3.8-3.9 4.4-7.1.8-4.4-.6-9.2-4.4-13.9Z" />
      <path d="M12 4v16" stroke="rgba(201,169,97,0.5)" strokeWidth="0.7" fill="none" />
    </svg>
  )
}

export default function Checker() {
  const [selectedDrugs, setSelectedDrugs] = useState([])
  const [selectedHerbs, setSelectedHerbs] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef(null)

  const canCheck = selectedDrugs.length > 0 && selectedHerbs.length > 0

  function runCheck() {
    if (!canCheck) return
    setLoading(true)
    setResults(null)
    // brief processing delay so the spinner reads as deliberate feedback
    setTimeout(() => {
      const matched = matchAll(selectedDrugs, selectedHerbs)
      setResults(matched)
      setLoading(false)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    }, 450)
  }

  function reset() {
    setSelectedDrugs([])
    setSelectedHerbs([])
    setResults(null)
  }

  const highCount = results?.filter((r) => r.risk_level === 'high').length ?? 0

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* faint botanical accents — lighter than the home page */}
      <LeafShape
        size={220}
        className="pointer-events-none absolute -right-16 -top-8 -z-10 rotate-[24deg] text-brand-100/50"
      />
      <LeafShape
        size={150}
        className="pointer-events-none absolute -left-14 top-1/2 -z-10 -rotate-[18deg] text-gold-100/60"
      />

      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          ตรวจสอบ<span className="text-luxe">อันตรกิริยา</span>
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          เพิ่มยาที่กินอยู่และสมุนไพรที่จะกิน ระบบจะจับคู่ทุกยากับทุกสมุนไพร
          แล้วแสดงผลทุกคู่พร้อมระดับความเสี่ยงและคำแนะนำ
        </p>
      </motion.header>

      {/* Input panel */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl border-gold-400/30 p-5 shadow-lift sm:p-7"
      >
        {/* gold top accent — a touch bolder for a defined header edge */}
        <span
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
          aria-hidden="true"
        />
        <span
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gold-50/60 to-transparent"
          aria-hidden="true"
        />
        <div className="relative grid gap-6 md:grid-cols-2">
          <MultiSelectInput
            label="ยาที่กินอยู่"
            icon={Pill}
            options={drugs}
            selected={selectedDrugs}
            onChange={setSelectedDrugs}
            placeholder="เช่น วาร์ฟาริน, Warfarin, ดิจอกซิน..."
          />
          <MultiSelectInput
            label="สมุนไพร / อาหารเสริมที่จะกิน"
            icon={Leaf}
            options={herbs}
            selected={selectedHerbs}
            onChange={setSelectedHerbs}
            placeholder="เช่น กระเทียม, Ginkgo, ขมิ้นชัน..."
          />
        </div>

        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            onClick={runCheck}
            disabled={!canCheck || loading}
            whileHover={canCheck ? { scale: 1.03 } : undefined}
            whileTap={canCheck ? { scale: 0.97 } : undefined}
            className={`btn-primary px-7 disabled:cursor-not-allowed disabled:opacity-50 ${
              canCheck && !loading ? 'animate-pulse-glow shadow-glow' : ''
            }`}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <Search size={18} aria-hidden="true" />
            )}
            ตรวจสอบ
          </motion.button>

          {(selectedDrugs.length > 0 || selectedHerbs.length > 0) && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <RotateCcw size={15} aria-hidden="true" />
              ล้างทั้งหมด
            </button>
          )}

          {canCheck && !loading ? (
            <span className="text-sm text-ink-soft">
              จะตรวจ {selectedDrugs.length * selectedHerbs.length} คู่
            </span>
          ) : null}
        </div>
      </motion.section>

      {/* Results / states */}
      <div ref={resultsRef} className="mt-8 scroll-mt-24">
        {loading ? <LoadingState /> : null}

        {!loading && results === null ? <EmptyState /> : null}

        {!loading && results !== null ? (
          <div>
            {highCount > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 rounded-2xl border-l-4 border-risk-high bg-risk-highBg p-4 text-risk-high"
              >
                <AlertTriangle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-bold">พบคู่ที่มีความเสี่ยงสูง {highCount} คู่</p>
                  <p className="mt-0.5 text-sm font-medium text-red-700/90">
                    ควรหลีกเลี่ยงการใช้ร่วมกัน และปรึกษาแพทย์หรือเภสัชกรโดยเร็ว
                  </p>
                </div>
              </motion.div>
            ) : null}

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">
                ผลการตรวจสอบ ({results.length} คู่)
              </h2>
            </div>

            <motion.div
              variants={listContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {results.map((item) => (
                <InteractionCard key={item.id} item={item} />
              ))}
            </motion.div>

            <Disclaimer className="mt-6" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface flex flex-col items-center px-6 py-16 text-center"
    >
      <div className="relative">
        {/* soft halo + small leaves flanking the icon */}
        <span
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-100/50 to-gold-100/40 blur-xl"
          aria-hidden="true"
        />
        <motion.span
          animate={{ y: [0, -4, 0], rotate: [-14, -8, -14] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-7 top-1 text-brand-300/80"
          aria-hidden="true"
        >
          <Leaf size={22} />
        </motion.span>
        <motion.span
          animate={{ y: [0, -5, 0], rotate: [16, 10, 16] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute -right-7 top-3 text-gold-400/80"
          aria-hidden="true"
        >
          <Leaf size={18} />
        </motion.span>
        <motion.span
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-gold-50 ring-1 ring-gold-300/50"
        >
          <ClipboardList size={38} className="text-brand-600" aria-hidden="true" />
        </motion.span>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-ink">ยังไม่มีผลการตรวจสอบ</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        เพิ่มยาที่กินอยู่อย่างน้อย 1 ชนิด และสมุนไพรที่จะกินอย่างน้อย 1 ชนิด
        จากนั้นกดปุ่ม &ldquo;ตรวจสอบ&rdquo; เพื่อดูผลทุกคู่พร้อมกัน
      </p>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div className="grid gap-4">
      {/* Herbal spinner: emerald ring with gold tip + breathing leaf */}
      <div className="flex flex-col items-center gap-3 py-4 text-ink-soft">
        <span className="relative flex h-14 w-14 items-center justify-center">
          <span
            className="absolute inset-0 animate-spin rounded-full border-2 border-brand-100 border-t-gold-400"
            style={{ animationDuration: '0.9s' }}
            aria-hidden="true"
          />
          <motion.span
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-brand-600"
          >
            <Leaf size={22} aria-hidden="true" />
          </motion.span>
        </span>
        กำลังตรวจสอบ...
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card-surface border-l-4 border-brand-100 p-6">
          <div className="shimmer h-5 w-1/2 rounded" />
          <div className="shimmer mt-3 h-3 w-1/3 rounded" />
          <div className="shimmer mt-5 h-10 w-full rounded-xl" />
          <div className="shimmer mt-4 h-3 w-3/4 rounded" />
        </div>
      ))}
    </div>
  )
}
