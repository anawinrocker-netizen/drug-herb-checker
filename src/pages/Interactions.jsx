import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowUpDown, SearchX, Leaf, Pill } from 'lucide-react'
import interactions from '../data/interactions.json'
import { RISK, RISK_ORDER, getRisk } from '../lib/risk.js'
import RiskBadge from '../components/RiskBadge.jsx'
import EvidenceBadge from '../components/EvidenceBadge.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

const uniqSorted = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'th'))

export default function Interactions() {
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState('all')
  const [drugClass, setDrugClass] = useState('all')
  const [herb, setHerb] = useState('all')
  const [sortKey, setSortKey] = useState('risk') // 'risk' | 'herb' | 'drug'

  const drugClasses = useMemo(() => uniqSorted(interactions.map((i) => i.drug_class)), [])
  const herbNames = useMemo(() => uniqSorted(interactions.map((i) => i.herb_th)), [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let r = interactions.filter((it) => {
      if (risk !== 'all' && it.risk_level !== risk) return false
      if (drugClass !== 'all' && it.drug_class !== drugClass) return false
      if (herb !== 'all' && it.herb_th !== herb) return false
      if (q) {
        const hay = `${it.herb_th} ${it.herb_en} ${it.drug_th} ${it.drug_en} ${it.effect}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    r = [...r].sort((a, b) => {
      if (sortKey === 'risk') {
        const d = (RISK[a.risk_level]?.order ?? 9) - (RISK[b.risk_level]?.order ?? 9)
        if (d !== 0) return d
        return a.herb_th.localeCompare(b.herb_th, 'th')
      }
      if (sortKey === 'herb') return a.herb_th.localeCompare(b.herb_th, 'th')
      return a.drug_th.localeCompare(b.drug_th, 'th')
    })
    return r
  }, [query, risk, drugClass, herb, sortKey])

  const highTotal = useMemo(
    () => interactions.filter((i) => i.risk_level === 'high').length,
    []
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          คู่ยา-สมุนไพร<span className="text-luxe">ที่ควรระวัง</span>
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          ฐานข้อมูลปฏิกิริยาทั้งหมด {interactions.length} คู่ (เสี่ยงสูง {highTotal} คู่)
          ค้นหาและกรองตามระดับความเสี่ยง กลุ่มยา หรือสมุนไพรได้
        </p>
      </motion.header>

      {/* Filter bar */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl border-gold-400/30 p-4 sm:p-5"
      >
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
          aria-hidden="true"
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหายา สมุนไพร หรือผล..."
              className="w-full rounded-2xl border border-brand-200 bg-white py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-300"
            />
          </div>

          <FilterSelect
            label="ระดับความเสี่ยง"
            value={risk}
            onChange={setRisk}
            options={[
              { value: 'all', label: 'ทุกระดับ' },
              ...RISK_ORDER.map((k) => ({ value: k, label: RISK[k].label })),
            ]}
          />
          <FilterSelect
            label="กลุ่มยา"
            value={drugClass}
            onChange={setDrugClass}
            options={[
              { value: 'all', label: 'ทุกกลุ่มยา' },
              ...drugClasses.map((c) => ({ value: c, label: c })),
            ]}
          />
          <FilterSelect
            label="สมุนไพร"
            value={herb}
            onChange={setHerb}
            options={[
              { value: 'all', label: 'ทุกสมุนไพร' },
              ...herbNames.map((h) => ({ value: h, label: h })),
            ]}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <Filter size={15} aria-hidden="true" />
            แสดง {rows.length} จาก {interactions.length} คู่
          </span>
          <label className="inline-flex items-center gap-2 text-ink-soft">
            <ArrowUpDown size={15} aria-hidden="true" />
            เรียงตาม
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="rounded-xl border border-brand-200 bg-white px-2 py-1 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-300"
            >
              <option value="risk">ความเสี่ยง (สูง→ต่ำ)</option>
              <option value="herb">ชื่อสมุนไพร</option>
              <option value="drug">ชื่อยา</option>
            </select>
          </label>
        </div>
      </motion.section>

      {rows.length === 0 ? (
        <div className="card-surface mt-6 flex flex-col items-center px-6 py-16 text-center">
          <SearchX size={40} className="text-ink-soft" aria-hidden="true" />
          <p className="mt-4 font-medium text-ink">ไม่พบคู่ที่ตรงกับเงื่อนไข</p>
          <p className="mt-1 text-sm text-ink-soft">ลองปรับคำค้นหรือตัวกรอง</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-gold-300/40 bg-white/95 shadow-soft backdrop-blur-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-brand-50/90 to-gold-50/70 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">สมุนไพร</th>
                  <th className="px-4 py-3 font-semibold">ยา</th>
                  <th className="px-4 py-3 font-semibold">ผลที่เกิด</th>
                  <th className="px-4 py-3 font-semibold">ความเสี่ยง</th>
                  <th className="px-4 py-3 font-semibold">หลักฐาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {rows.map((it) => {
                  const r = getRisk(it.risk_level)
                  return (
                    <tr
                      key={it.id}
                      className="align-top transition-colors hover:bg-brand-50/40"
                      style={{ boxShadow: `inset 3px 0 0 ${r.border}` }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink">{it.herb_th}</div>
                        <div className="text-xs text-ink-soft">{it.herb_en}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink">{it.drug_th}</div>
                        <div className="text-xs text-ink-soft">{it.drug_class}</div>
                      </td>
                      <td className="max-w-sm px-4 py-3 text-ink">{it.effect}</td>
                      <td className="px-4 py-3">
                        <RiskBadge level={it.risk_level} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <EvidenceBadge level={it.evidence} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 grid gap-3 lg:hidden">
            {rows.map((it, i) => {
              const r = getRisk(it.risk_level)
              return (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                  className="card-surface border-l-4 p-4"
                  style={{ borderLeftColor: r.border }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1 text-sm">
                      <div className="flex items-center gap-1.5 font-semibold text-ink">
                        <Leaf size={15} className="text-brand-600" aria-hidden="true" />
                        {it.herb_th}
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-ink">
                        <Pill size={15} className="text-brand-600" aria-hidden="true" />
                        {it.drug_th}
                      </div>
                      <div className="text-xs text-ink-soft">{it.drug_class}</div>
                    </div>
                    <RiskBadge level={it.risk_level} size="sm" />
                  </div>
                  <p className="mt-3 text-sm text-ink">{it.effect}</p>
                  <div className="mt-3">
                    <EvidenceBadge level={it.evidence} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </>
      )}

      <Disclaimer variant="subtle" className="mt-8" />
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-300"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
