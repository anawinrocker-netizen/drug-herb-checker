import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ScrollText,
  Target,
  Stethoscope,
  Database,
  ShieldAlert,
  PhoneCall,
} from 'lucide-react'

const SECTIONS = [
  {
    icon: Target,
    title: '1. วัตถุประสงค์ของระบบ',
    body: 'ระบบคัดกรองอันตรกิริยาระหว่างยาและสมุนไพรสำหรับผู้ป่วยโรคหัวใจนี้ พัฒนาขึ้นเพื่อเป็นเครื่องมือให้ข้อมูลและคัดกรองความเสี่ยงเบื้องต้นเท่านั้น มีวัตถุประสงค์เพื่อการศึกษาและสร้างความตระหนักรู้',
  },
  {
    icon: Stethoscope,
    title: '2. ไม่ทดแทนคำวินิจฉัยของแพทย์',
    body: 'ข้อมูลและผลการคัดกรองทั้งหมดในระบบนี้ ไม่สามารถใช้ทดแทนคำวินิจฉัย คำแนะนำ หรือการสั่งจ่ายยาของแพทย์ เภสัชกร หรือบุคลากรทางการแพทย์ที่มีใบอนุญาตได้ ผู้ใช้ต้องปรึกษาแพทย์หรือเภสัชกรก่อนเริ่ม หยุด หรือเปลี่ยนแปลงการใช้ยาและสมุนไพรทุกครั้ง',
  },
  {
    icon: Database,
    title: '3. ข้อจำกัดของข้อมูล',
    body: 'ระบบแสดงผลเป็นการคัดกรองความเสี่ยงเบื้องต้นโดยอ้างอิงจากหลักเกณฑ์ทั่วไปทางเภสัชวิทยา ไม่ได้คำนวณปัจจัยเฉพาะบุคคล เช่น อายุ น้ำหนัก การทำงานของตับและไต ปริมาณหรือความเข้มข้นที่รับประทานจริง โรคประจำตัวอื่น หรือยาอื่นที่ใช้ร่วม การไม่พบข้อมูลคู่ยา-สมุนไพรในระบบ ไม่ได้หมายความว่าปลอดภัย แต่หมายถึงยังไม่มีข้อมูลบันทึกไว้',
  },
  {
    icon: ShieldAlert,
    title: '4. การยอมรับความเสี่ยง',
    body: 'ผู้ใช้รับทราบและยอมรับว่าการใช้งานระบบนี้เป็นความรับผิดชอบของผู้ใช้เอง คณะผู้พัฒนาไม่รับผิดชอบต่อความเสียหายใดๆ ที่อาจเกิดขึ้นจากการนำข้อมูลไปใช้โดยไม่ปรึกษาบุคลากรทางการแพทย์',
  },
  {
    icon: PhoneCall,
    title: '5. กรณีฉุกเฉิน',
    body: 'หากมีอาการผิดปกติรุนแรง เช่น เลือดออกไม่หยุด หายใจลำบาก เจ็บหน้าอก ใจสั่น หรือหมดสติ ให้รีบพบแพทย์หรือโทร 1669 ทันที',
  },
]

// Frosted-glass modal showing the terms of use / liability disclaimer.
export default function TermsModal({ open, onClose }) {
  // Close on Escape while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-900/45 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-gold-400/40"
          >
            {/* Gold hairline at top */}
            <span
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent"
              aria-hidden="true"
            />

            <div className="flex items-start justify-between gap-4 border-b border-brand-100/70 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-gold-200 shadow-soft ring-1 ring-gold-400/40">
                  <ScrollText size={22} aria-hidden="true" />
                </span>
                <h2 id="terms-title" className="text-lg font-bold leading-snug text-ink sm:text-xl">
                  ข้อตกลงการใช้งานและข้อจำกัดความรับผิดชอบ
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="ปิดหน้าต่างข้อตกลง"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 sm:px-8">
              <div className="space-y-6">
                {SECTIONS.map((s) => (
                  <section key={s.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-gold-300/40">
                      <s.icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{s.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </section>
                ))}
              </div>

              <p className="mt-7 rounded-2xl border border-gold-300/50 bg-gold-50/80 px-4 py-3.5 text-sm font-medium leading-relaxed text-gold-700">
                เมื่อติ๊กยอมรับ ถือว่าผู้ใช้ได้อ่านและเข้าใจข้อตกลงข้างต้นแล้ว
              </p>
            </div>

            <div className="border-t border-brand-100/70 px-6 py-4 text-right sm:px-8">
              <button type="button" onClick={onClose} className="btn-primary px-8 py-2.5 text-sm">
                รับทราบ
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

// Custom animated checkbox: the check mark draws itself when ticked.
export function AgreeCheckbox({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
          checked
            ? 'border-gold-400 bg-gradient-to-br from-brand-600 to-brand-800 shadow-glow'
            : 'border-brand-300 bg-white/80 hover:border-gold-400'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <motion.path
            d="M4.5 12.5l5 5L19.5 7"
            stroke="#E9DCB8"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          />
        </svg>
      </button>
      <span className="text-sm leading-relaxed text-ink-soft">{children}</span>
    </label>
  )
}
