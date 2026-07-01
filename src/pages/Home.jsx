import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import interactions from '../data/interactions.json'
import drugs from '../data/drugs.json'
import herbs from '../data/herbs.json'

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-700 to-brand-600 text-white">
        {/* dotted texture */}
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        {/* soft blurred blobs */}
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-emerald-200/15 blur-3xl"
          aria-hidden="true"
        />

        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-24"
        >
          <motion.span
            variants={heroItem}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-50 ring-1 ring-white/20"
          >
            <ShieldCheck size={15} aria-hidden="true" />
            เครื่องมือคัดกรองสำหรับผู้ป่วยโรคหัวใจ
          </motion.span>

          <motion.h1
            variants={heroItem}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            ระบบคัดกรองอันตรกิริยา
            <br className="hidden sm:block" />
            ระหว่างยาและสมุนไพร
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-50/90 sm:text-lg"
          >
            ตรวจสอบเบื้องต้นว่ายาหัวใจที่คุณใช้อยู่กับสมุนไพรหรืออาหารเสริมที่จะกิน
            มีความเสี่ยงเกิดปฏิกิริยาต่อกันหรือไม่ พร้อมระดับหลักฐานและคำแนะนำ
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/checker">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-soft transition-colors hover:bg-brand-50"
              >
                <Search size={18} aria-hidden="true" />
                เริ่มตรวจสอบ
                <ArrowRight size={18} aria-hidden="true" />
              </motion.span>
            </Link>
            <Link
              to="/interactions"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
            >
              ดูคู่ที่ไม่ควรใช้ร่วม
            </Link>
          </motion.div>

          {/* stats */}
          <motion.div
            variants={heroItem}
            className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 px-3 py-4 ring-1 ring-white/15">
                <div className="text-2xl font-bold sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-brand-50/80 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <WaveDivider color="#F8FBF9" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">จุดเด่นของระบบ</h2>
          <p className="mt-3 text-ink-soft">
            ออกแบบให้อ่านง่ายและตัดสินใจได้เร็ว บนพื้นฐานข้อมูลที่ระบุระดับหลักฐาน
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card-surface p-6 transition-shadow hover:shadow-lift"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <f.icon size={24} strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works strip */}
      <section className="bg-brand-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                ใช้งานง่ายใน 3 ขั้นตอน
              </h2>
              <ol className="mt-6 space-y-4">
                {[
                  { icon: Pill, text: 'เลือกยาหัวใจที่กินอยู่ (ค้นได้ทั้งชื่อไทยและอังกฤษ)' },
                  { icon: Leaf, text: 'เลือกสมุนไพรหรืออาหารเสริมที่ต้องการจะกิน' },
                  { icon: Search, text: 'กดตรวจสอบ แล้วอ่านผลทุกคู่ที่เรียงตามความเสี่ยง' },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft">
                      <step.icon size={20} aria-hidden="true" />
                    </span>
                    <p className="pt-1.5 leading-relaxed text-ink">{step.text}</p>
                  </li>
                ))}
              </ol>
              <Link to="/checker" className="btn-primary mt-8">
                <Search size={18} aria-hidden="true" />
                ไปที่หน้าตรวจสอบ
              </Link>
            </div>

            <Disclaimer />
          </div>
        </div>
      </section>
    </div>
  )
}
