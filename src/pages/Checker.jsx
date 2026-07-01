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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">ตรวจสอบอันตรกิริยา</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          เพิ่มยาที่กินอยู่และสมุนไพรที่จะกิน ระบบจะจับคู่ทุกยากับทุกสมุนไพร
          แล้วแสดงผลทุกคู่พร้อมระดับความเสี่ยงและคำแนะนำ
        </p>
      </header>

      {/* Input panel */}
      <section className="card-surface p-5 sm:p-7">
        <div className="grid gap-6 md:grid-cols-2">
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

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            onClick={runCheck}
            disabled={!canCheck || loading}
            whileHover={canCheck ? { scale: 1.03 } : undefined}
            whileTap={canCheck ? { scale: 0.97 } : undefined}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
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
      </section>

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
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
        <ClipboardList size={38} className="text-brand-600" aria-hidden="true" />
      </span>
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
      <div className="flex items-center justify-center gap-2 py-2 text-ink-soft">
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        กำลังตรวจสอบ...
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card-surface animate-pulse border-l-4 border-brand-100 p-6">
          <div className="h-5 w-1/2 rounded bg-brand-50" />
          <div className="mt-3 h-3 w-1/3 rounded bg-brand-50" />
          <div className="mt-5 h-10 w-full rounded-xl bg-brand-50" />
          <div className="mt-4 h-3 w-3/4 rounded bg-brand-50" />
        </div>
      ))}
    </div>
  )
}
