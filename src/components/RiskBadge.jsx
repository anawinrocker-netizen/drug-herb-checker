import { getRisk } from '../lib/risk.js'

// Small pill badge showing the risk level with its icon. Color is applied only
// to the badge (per design spec) — never to the whole card surface.
export default function RiskBadge({ level, size = 'md' }) {
  const r = getRisk(level)
  const Icon = r.icon
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ring-black/[0.04] ${pad} ${r.bg} ${r.badgeText}`}
    >
      <Icon size={iconSize} strokeWidth={2.2} aria-hidden="true" />
      {r.label}
    </span>
  )
}
