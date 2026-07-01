import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pill, Leaf, Search, FileText, ChevronDown, BookMarked } from 'lucide-react'
import { RISK, RISK_ORDER, EVIDENCE } from '../lib/risk.js'
import Disclaimer from '../components/Disclaimer.jsx'

const STEPS = [
  { icon: Pill, title: 'ใส่ยาที่กินอยู่', desc: 'ไปที่หน้า "ตรวจสอบ" แล้วพิมพ์ชื่อยาหัวใจที่ใช้อยู่ เลือกได้หลายชนิด ค้นหาได้ทั้งชื่อไทยและอังกฤษ' },
  { icon: Leaf, title: 'ใส่สมุนไพรที่จะกิน', desc: 'เพิ่มสมุนไพรหรืออาหารเสริมที่ต้องการจะกิน เลือกได้หลายชนิดเช่นกัน' },
  { icon: Search, title: 'กดตรวจสอบ', desc: 'ระบบจะจับคู่ยาทุกตัวกับสมุนไพรทุกตัว แล้วแสดงผลทุกคู่พร้อมกัน เรียงจากเสี่ยงสูงไปต่ำ' },
  { icon: FileText, title: 'อ่านผลและคำแนะนำ', desc: 'แต่ละคู่แสดงระดับความเสี่ยง ระดับหลักฐาน ผลที่เกิด อาการที่อาจพบ และคำแนะนำ' },
]

const FAQS = [
  {
    q: 'ไม่เจอคู่ยา-สมุนไพร แปลว่าปลอดภัยไหม?',
    a: 'ไม่ใช่ การไม่พบคู่ในฐานข้อมูลหมายความว่า "ยังไม่ถูกศึกษา/ไม่ทราบ" ซึ่งไม่เท่ากับปลอดภัย อาจมีปฏิกิริยาที่ยังไม่มีรายงาน ควรปรึกษาแพทย์หรือเภสัชกรก่อนใช้ร่วมกันเสมอ',
  },
  {
    q: 'ระบบนี้แทนแพทย์หรือเภสัชกรได้ไหม?',
    a: 'ไม่ได้ ระบบนี้เป็นเครื่องมือคัดกรองเบื้องต้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำวินิจฉัยทางการแพทย์ ผู้ป่วยไม่ควรเริ่ม หยุด หรือเปลี่ยนยา/สมุนไพรเองโดยไม่ปรึกษาผู้เชี่ยวชาญ',
  },
  {
    q: 'ข้อมูลมาจากไหน?',
    a: 'รวบรวมจากงานทบทวนวรรณกรรมและฐานข้อมูลทางคลินิก เช่น Tan & Lee 2021, Choi et al. 2017, UC San Diego Health, โรงพยาบาลบำรุงราษฎร์ และ Memorial Sloan Kettering ทั้งนี้คุณภาพของหลักฐานแตกต่างกัน ระบบจึงแสดงระดับหลักฐานกำกับทุกคู่',
  },
  {
    q: 'ทำไมสมุนไพรยอดนิยมบางตัว (กระเทียม ขิง โสม) ถึงเป็น "หลักฐานขัดแย้ง"?',
    a: 'เพราะการศึกษาแบบ RCT มักไม่พบผลที่มีนัยสำคัญ แต่ยังมีรายงานผู้ป่วยที่พบเลือดออก เราจึงแสดงเป็น "หลักฐานขัดแย้ง" แทนที่จะเป็น "เสี่ยงสูง" เพื่อให้เห็นทั้งสองด้าน',
  },
  {
    q: 'ปริมาณอาหารปกติกับอาหารเสริมต่างกันไหม?',
    a: 'ต่างกัน สมุนไพรอย่างกระเทียม ขิง ขมิ้น ชาเขียว ในปริมาณอาหารปกติมักมีความเสี่ยงต่ำ แต่รูปแบบแคปซูล/สารสกัดเข้มข้นหรือปริมาณสูงจะเพิ่มความเสี่ยงขึ้น คำแนะนำในแต่ละคู่ได้ระบุเกณฑ์ปริมาณไว้',
  },
  {
    q: 'ใช้ยาวาร์ฟารินต้องระวังอะไรเป็นพิเศษ?',
    a: 'วาร์ฟารินมีช่วงการรักษาแคบและไวต่อสมุนไพรหลายชนิด ผู้ใช้ควรตรวจ INR สม่ำเสมอ และแจ้งแพทย์ทุกครั้งที่จะเริ่มหรือหยุดสมุนไพร/อาหารเสริม',
  },
]

export default function Help() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">วิธีใช้งานและคำถามที่พบบ่อย</h1>
        <p className="mt-2 text-ink-soft">เรียนรู้วิธีใช้ระบบ ความหมายของระดับความเสี่ยงและหลักฐาน</p>
      </header>

      {/* Steps */}
      <section>
        <h2 className="text-xl font-semibold text-ink">วิธีใช้ทีละขั้น</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="card-surface flex gap-4 p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <s.icon size={22} aria-hidden="true" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-600">ขั้นที่ {i + 1}</span>
                </div>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Legends */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="text-lg font-semibold text-ink">ระดับความเสี่ยง 4 ระดับ</h2>
          <ul className="mt-4 space-y-3">
            {RISK_ORDER.map((k) => {
              const r = RISK[k]
              const Icon = r.icon
              return (
                <li key={k} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${r.bg} ${r.text}`}
                  >
                    <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <div className="text-sm">
                    <span className={`font-semibold ${r.text}`}>{r.label}</span>
                    <p className="text-ink-soft">{r.note}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-lg font-semibold text-ink">ระดับหลักฐาน 3 แบบ</h2>
          <ul className="mt-4 space-y-3">
            {['documented', 'conflicting', 'theoretical'].map((k) => {
              const e = EVIDENCE[k]
              return (
                <li key={k} className="text-sm">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${e.classes}`}
                  >
                    {e.label}
                  </span>
                  <p className="mt-1 text-ink-soft">{e.desc}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-ink">คำถามที่พบบ่อย</h2>
        <div className="mt-4 space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <Disclaimer className="mt-12" />

      {/* References */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <BookMarked size={20} className="text-brand-600" aria-hidden="true" />
          แหล่งอ้างอิง
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
          <li>Tan CSS, Lee SWH. Warfarin and food, herbal or dietary supplement interactions: A systematic review. Br J Clin Pharmacol. 2021.</li>
          <li>Choi S, et al. The effects of herbal medicines on the pharmacokinetics/pharmacodynamics of warfarin: a systematic review of RCTs. PLoS One. 2017.</li>
          <li>UC San Diego Health. Warfarin (Coumadin) and Vitamin K / Supplement Interactions.</li>
          <li>Bumrungrad Hospital. Drug-Herb Interactions resources.</li>
          <li>Memorial Sloan Kettering Cancer Center. About Herbs, Botanicals &amp; Other Products.</li>
          <li>Tannergren C, et al. St John's wort decreases the bioavailability of CYP3A4 substrates. 2004.</li>
        </ul>
        <p className="mt-4 text-xs text-ink-soft/80">
          หมายเหตุ: ข้อมูลบางส่วนอ้างอิงจากรายงานผู้ป่วย การศึกษาในสัตว์ หรือ in-vitro
          ควรตรวจสอบกับแหล่งปฐมภูมิและผู้เชี่ยวชาญก่อนนำไปใช้จริง
        </p>
      </section>
    </div>
  )
}

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-ink">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-brand-600">
          <ChevronDown size={20} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
