import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'

// Risk level metadata: ordering, labels, colors and the lucide icon to use.
// Colors here are plain hex (matching the Tailwind theme) so they can be used
// both in className-driven and inline-style contexts.
export const RISK = {
  high: {
    key: 'high',
    label: 'เสี่ยงสูง',
    short: 'สูง',
    order: 0,
    icon: AlertTriangle,
    text: 'text-risk-high',
    bg: 'bg-risk-highBg',
    badgeText: 'text-risk-high',
    border: '#DC2626',
    note: 'ควรหลีกเลี่ยงการใช้ร่วมกัน',
  },
  medium: {
    key: 'medium',
    label: 'เสี่ยงปานกลาง',
    short: 'กลาง',
    order: 1,
    icon: AlertCircle,
    text: 'text-risk-medium',
    bg: 'bg-risk-mediumBg',
    badgeText: 'text-risk-medium',
    border: '#D97706',
    note: 'ใช้ได้แต่ต้องระวัง / อยู่ภายใต้การดูแลและติดตาม',
  },
  low: {
    key: 'low',
    label: 'เสี่ยงต่ำ',
    short: 'ต่ำ',
    order: 2,
    icon: CheckCircle,
    text: 'text-risk-low',
    bg: 'bg-risk-lowBg',
    badgeText: 'text-risk-low',
    border: '#16A34A',
    note: 'ความเสี่ยงน้อย หรือปลอดภัยในปริมาณอาหารปกติ',
  },
  unknown: {
    key: 'unknown',
    label: 'ไม่ทราบ',
    short: 'ไม่ทราบ',
    order: 3,
    icon: HelpCircle,
    text: 'text-risk-unknown',
    bg: 'bg-risk-unknownBg',
    badgeText: 'text-risk-unknown',
    border: '#6B7280',
    note: 'ยังไม่มีข้อมูล (ไม่ได้แปลว่าปลอดภัย)',
  },
}

export const RISK_ORDER = ['high', 'medium', 'low', 'unknown']

export function getRisk(level) {
  return RISK[level] || RISK.unknown
}

// Evidence level metadata. "" / unknown is handled gracefully for source rows
// that did not provide an evidence column.
export const EVIDENCE = {
  documented: {
    key: 'documented',
    label: 'มีหลักฐานชัดเจน',
    desc: 'มีรายงานผู้ป่วยหรือการศึกษาทางคลินิก',
    classes: 'border-brand-200 bg-brand-50 text-brand-800',
  },
  conflicting: {
    key: 'conflicting',
    label: 'หลักฐานขัดแย้ง',
    desc: 'RCT และรายงานผู้ป่วยให้ผลต่างกัน',
    classes: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  theoretical: {
    key: 'theoretical',
    label: 'เชิงทฤษฎี/ก่อนคลินิก',
    desc: 'ข้อมูลจากสัตว์ทดลองหรือ in-vitro เท่านั้น',
    classes: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  unknown: {
    key: 'unknown',
    label: 'ไม่ระบุระดับหลักฐาน',
    desc: 'ต้นทางไม่ได้ระบุระดับหลักฐานชัดเจน',
    classes: 'border-slate-200 bg-slate-50 text-slate-500',
  },
}

export function getEvidence(level) {
  if (!level) return EVIDENCE.unknown
  return EVIDENCE[level] || EVIDENCE.unknown
}
