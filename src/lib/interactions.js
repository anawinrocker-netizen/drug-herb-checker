import interactions from '../data/interactions.json'
import { RISK } from './risk.js'

// Build a fast lookup keyed by english herb + english drug name.
const key = (herbEn, drugEn) => `${herbEn}__${drugEn}`.toLowerCase()

const index = new Map()
for (const it of interactions) {
  index.set(key(it.herb_en, it.drug_en), it)
}

// Given a selected herb (master object {th,en,...}) and drug (master object),
// return the matching interaction record, or a synthesised "unknown" record
// when the pair is not in the database. An unknown pair must NEVER be shown as
// safe — it is rendered as a gray "no data" card.
export function lookupPair(herb, drug) {
  const found = index.get(key(herb.en, drug.en))
  if (found) return { ...found, found: true }

  return {
    id: `nd-${herb.id}-${drug.id}`,
    found: false,
    herb_th: herb.th,
    herb_en: herb.en,
    herb_sci: herb.sci || 'ไม่ระบุ',
    drug_th: drug.th,
    drug_en: drug.en,
    drug_class: drug.class || 'ไม่ระบุ',
    effect: 'ไม่พบข้อมูลปฏิกิริยาคู่นี้ในฐานข้อมูล',
    risk_level: 'unknown',
    evidence: '',
    symptoms: 'ไม่ระบุ',
    recommendation:
      'ไม่พบข้อมูล ไม่ได้แปลว่าปลอดภัย ควรปรึกษาแพทย์หรือเภสัชกรก่อนใช้ร่วมกัน',
  }
}

// Match every selected drug against every selected herb, returning all pairs
// sorted from highest risk to lowest (then by name for stability).
export function matchAll(drugs, herbs) {
  const results = []
  for (const drug of drugs) {
    for (const herb of herbs) {
      results.push(lookupPair(herb, drug))
    }
  }
  results.sort((a, b) => {
    const ra = RISK[a.risk_level]?.order ?? 99
    const rb = RISK[b.risk_level]?.order ?? 99
    if (ra !== rb) return ra - rb
    return `${a.herb_th}${a.drug_th}`.localeCompare(`${b.herb_th}${b.drug_th}`, 'th')
  })
  return results
}

export { interactions }
