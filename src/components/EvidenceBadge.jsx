import { FlaskConical } from 'lucide-react'
import { getEvidence } from '../lib/risk.js'

// Outlined badge describing the strength of evidence for an interaction.
export default function EvidenceBadge({ level }) {
  const e = getEvidence(level)
  return (
    <span
      title={e.desc}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${e.classes}`}
    >
      <FlaskConical size={13} strokeWidth={2} aria-hidden="true" />
      {e.label}
    </span>
  )
}
