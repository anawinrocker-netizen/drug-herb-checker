import { motion } from 'framer-motion'
import { Pill, Leaf, Activity, Stethoscope, Lightbulb } from 'lucide-react'
import { getRisk } from '../lib/risk.js'
import RiskBadge from './RiskBadge.jsx'
import EvidenceBadge from './EvidenceBadge.jsx'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// One result card for a single drug-herb pair. The left border accent carries
// the risk color; the card surface stays white/neutral (per design spec).
export default function InteractionCard({ item }) {
  const r = getRisk(item.risk_level)
  const RiskIcon = r.icon

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="card-surface overflow-hidden border-l-4"
      style={{ borderLeftColor: r.border }}
    >
      <div className="p-5 sm:p-6">
        {/* Header: pair name + badges */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-semibold text-ink">
              <span className="inline-flex items-center gap-1.5">
                <Leaf size={18} className="text-brand-600" aria-hidden="true" />
                {item.herb_th}
              </span>
              <span className="text-ink-soft">+</span>
              <span className="inline-flex items-center gap-1.5">
                <Pill size={18} className="text-brand-600" aria-hidden="true" />
                {item.drug_th}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {item.herb_en} + {item.drug_en}
              {item.drug_class ? ` · ${item.drug_class}` : ''}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <RiskBadge level={item.risk_level} />
            {item.found ? <EvidenceBadge level={item.evidence} /> : null}
          </div>
        </div>

        {/* Risk note line */}
        <div className={`mt-4 flex items-center gap-2 rounded-xl ${r.bg} px-3 py-2 text-sm font-medium ${r.text}`}>
          <RiskIcon size={16} strokeWidth={2.2} aria-hidden="true" />
          {r.note}
        </div>

        {/* Detail rows */}
        <dl className="mt-4 space-y-3 text-sm">
          <DetailRow icon={Activity} label="ผลที่เกิด" value={item.effect} />
          {item.found && item.symptoms && item.symptoms !== 'ไม่ระบุ' ? (
            <DetailRow icon={Stethoscope} label="อาการที่อาจพบ" value={item.symptoms} />
          ) : null}
          <DetailRow
            icon={Lightbulb}
            label="คำแนะนำ"
            value={item.recommendation}
            highlight
          />
        </dl>
      </div>
    </motion.article>
  )
}

function DetailRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex gap-3">
      <dt className="flex w-28 shrink-0 items-center gap-1.5 font-medium text-ink-soft">
        <Icon size={15} strokeWidth={2} className="text-brand-600" aria-hidden="true" />
        {label}
      </dt>
      <dd className={`flex-1 leading-relaxed ${highlight ? 'font-medium text-ink' : 'text-ink'}`}>
        {value}
      </dd>
    </div>
  )
}
