// Generator: converts the curated drug-herb interaction data (transcribed from
// documents/textmedicine.txt) into src/data/interactions.json, drugs.json, herbs.json.
//
// Design notes / decisions (documented so they are auditable):
// - Grouped drugs in the source ("DOACs ทุกชนิด [...]", "VKA อื่น [...]") are
//   expanded into one interaction record per individual drug, using exactly the
//   drugs named in the source brackets (faithful, no over-reach).
// - Where the source gives a risk RANGE (e.g. "กลาง-สูง"), we take the HIGHER
//   value (precautionary principle for a safety-screening tool).
// - Evidence is mapped to: "documented" (มีหลักฐานชัดเจน / รายงานผู้ป่วย / RCT),
//   "conflicting" (หลักฐานขัดแย้ง), "theoretical" (เชิงทฤษฎี/ก่อนคลินิก/in-vitro).
//   "" (empty) where the source table provides no evidence column.
// - Missing fields use "ไม่ระบุ" or "" rather than guessed values.

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'src', 'data')

// ---------------------------------------------------------------------------
// Drug class labels (Thai)
// ---------------------------------------------------------------------------
const C = {
  VKA: 'ยาต้านการแข็งตัวของเลือด กลุ่มต้านวิตามินเค (VKA)',
  DOAC: 'ยาต้านการแข็งตัวของเลือด กลุ่มใหม่ (NOAC/DOAC)',
  HEPARIN: 'ยาต้านการแข็งตัวของเลือด (เฮพาริน)',
  ANTIPLATELET: 'ยาต้านเกล็ดเลือด (Antiplatelets)',
  ACEI: 'ยาลดความดัน กลุ่มยับยั้งเอนไซม์ ACE (ACE Inhibitors)',
  ARB: 'ยาลดความดัน กลุ่มต้านตัวรับแอนจิโอเทนซิน (ARBs)',
  CCB: 'ยาลดความดัน กลุ่มต้านแคลเซียม (CCBs)',
  BB: 'ยาลดความดัน กลุ่มปิดกั้นเบตา (Beta Blockers)',
  DIURETIC: 'ยาขับปัสสาวะ (Diuretics)',
  ANTIARR: 'ยาควบคุมจังหวะหัวใจ (Antiarrhythmics)',
  STATIN: 'ยาลดไขมัน กลุ่มสแตติน (Statins)',
  THYROID: 'ยาฮอร์โมนไทรอยด์',
  NSAID: 'ยาต้านการอักเสบ (NSAIDs)',
  ANTIDIABETIC: 'ยาลดน้ำตาลในเลือด',
}

// ---------------------------------------------------------------------------
// Drug master: id -> { th, en, class }
// ---------------------------------------------------------------------------
const DRUGS = {
  warfarin: { th: 'วาร์ฟาริน', en: 'Warfarin', class: C.VKA },
  acenocoumarol: { th: 'อะซีโนคูมารอล', en: 'Acenocoumarol', class: C.VKA },
  phenprocoumon: { th: 'เฟนโพรคูมอน', en: 'Phenprocoumon', class: C.VKA },

  apixaban: { th: 'อะพิกซาแบน', en: 'Apixaban', class: C.DOAC },
  rivaroxaban: { th: 'ริวารอกซาแบน', en: 'Rivaroxaban', class: C.DOAC },
  dabigatran: { th: 'ดาบิกาแทรน', en: 'Dabigatran', class: C.DOAC },
  edoxaban: { th: 'อิดอกซาแบน', en: 'Edoxaban', class: C.DOAC },
  heparin: { th: 'เฮพาริน', en: 'Heparin', class: C.HEPARIN },

  aspirin: { th: 'แอสไพริน', en: 'Aspirin', class: C.ANTIPLATELET },
  clopidogrel: { th: 'โคลพิโดเกรล', en: 'Clopidogrel', class: C.ANTIPLATELET },
  prasugrel: { th: 'พราซูเกรล', en: 'Prasugrel', class: C.ANTIPLATELET },
  ticagrelor: { th: 'ทิกาเกรลอร์', en: 'Ticagrelor', class: C.ANTIPLATELET },
  cilostazol: { th: 'ไซโลสตาซอล', en: 'Cilostazol', class: C.ANTIPLATELET },

  enalapril: { th: 'อีนาลาพริล', en: 'Enalapril', class: C.ACEI },
  lisinopril: { th: 'ลิซิโนพริล', en: 'Lisinopril', class: C.ACEI },
  ramipril: { th: 'รามิพริล', en: 'Ramipril', class: C.ACEI },
  captopril: { th: 'แคปโตพริล', en: 'Captopril', class: C.ACEI },

  losartan: { th: 'โลซาร์แทน', en: 'Losartan', class: C.ARB },
  valsartan: { th: 'วาลซาร์แทน', en: 'Valsartan', class: C.ARB },
  candesartan: { th: 'แคนเดซาร์แทน', en: 'Candesartan', class: C.ARB },

  amlodipine: { th: 'แอมโลดิพีน', en: 'Amlodipine', class: C.CCB },
  nifedipine: { th: 'ไนเฟดิพีน', en: 'Nifedipine', class: C.CCB },
  felodipine: { th: 'เฟโลดิพีน', en: 'Felodipine', class: C.CCB },
  diltiazem: { th: 'ดิลไทอะเซม', en: 'Diltiazem', class: C.CCB },
  verapamil: { th: 'เวอราพามิล', en: 'Verapamil', class: C.CCB },

  metoprolol: { th: 'เมโทโพรลอล', en: 'Metoprolol', class: C.BB },
  atenolol: { th: 'อะทีโนลอล', en: 'Atenolol', class: C.BB },
  bisoprolol: { th: 'บิโซโพรลอล', en: 'Bisoprolol', class: C.BB },
  carvedilol: { th: 'คาร์เวดิลอล', en: 'Carvedilol', class: C.BB },
  propranolol: { th: 'โพรพราโนลอล', en: 'Propranolol', class: C.BB },

  furosemide: { th: 'ฟูโรซีไมด์', en: 'Furosemide', class: C.DIURETIC },
  hctz: { th: 'ไฮโดรคลอโรไทอะไซด์', en: 'Hydrochlorothiazide', class: C.DIURETIC },
  spironolactone: { th: 'สไปโรโนแลคโตน', en: 'Spironolactone', class: C.DIURETIC },

  amiodarone: { th: 'อะมิโอดาโรน', en: 'Amiodarone', class: C.ANTIARR },
  digoxin: { th: 'ดิจอกซิน', en: 'Digoxin', class: C.ANTIARR },
  dronedarone: { th: 'โดรเนดาโรน', en: 'Dronedarone', class: C.ANTIARR },
  ivabradine: { th: 'ไอวาบราดีน', en: 'Ivabradine', class: C.ANTIARR },
  ranolazine: { th: 'ราโนลาซีน', en: 'Ranolazine', class: C.ANTIARR },

  atorvastatin: { th: 'อะทอร์วาสแตติน', en: 'Atorvastatin', class: C.STATIN },
  simvastatin: { th: 'ซิมวาสแตติน', en: 'Simvastatin', class: C.STATIN },
  rosuvastatin: { th: 'โรสุวาสแตติน', en: 'Rosuvastatin', class: C.STATIN },
  pravastatin: { th: 'พราวาสแตติน', en: 'Pravastatin', class: C.STATIN },

  levothyroxine: { th: 'เลโวไทรอกซิน', en: 'Levothyroxine', class: C.THYROID },
  diclofenac: { th: 'ไดโคลฟีแนค', en: 'Diclofenac', class: C.NSAID },
  antidiabetic: { th: 'ยาลดน้ำตาลในเลือด', en: 'Antidiabetic agents', class: C.ANTIDIABETIC },
}

// Convenience group expansions (use the drugs named in the source)
const VKA = ['warfarin', 'acenocoumarol', 'phenprocoumon']
const DOAC = ['apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban']
const STATIN = ['atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin']

// ---------------------------------------------------------------------------
// Herb master: id -> { th, en, sci }
// ---------------------------------------------------------------------------
const HERBS = {
  garlic: { th: 'กระเทียม', en: 'Garlic', sci: 'Allium sativum' },
  ginger: { th: 'ขิง', en: 'Ginger', sci: 'Zingiber officinale' },
  turmeric: { th: 'ขมิ้นชัน', en: 'Turmeric (Curcumin)', sci: 'Curcuma longa' },
  andrographis: { th: 'ฟ้าทะลายโจร', en: 'Fah-Talai-Jone', sci: 'Andrographis paniculata' },
  ginkgo: { th: 'แปะก๊วย', en: 'Ginkgo', sci: 'Ginkgo biloba' },
  ginseng: { th: 'โสม', en: 'Asian Ginseng', sci: 'Panax ginseng' },
  fishoil: { th: 'น้ำมันปลา / โอเมก้า-3', en: 'Fish oil / Omega-3', sci: 'ไม่ระบุ' },
  coq10: { th: 'โคเอนไซม์คิวเทน', en: 'Coenzyme Q-10 (CoQ10)', sci: 'ไม่ระบุ' },
  senna: { th: 'มะขามแขก', en: 'Senna', sci: 'Senna alexandrina' },
  stjohnswort: { th: 'เซนต์จอห์นเวิร์ต', en: "St John's wort", sci: 'Hypericum perforatum' },
  blackcohosh: { th: 'แบล็คโคฮอช', en: 'Black cohosh', sci: 'Actaea racemosa' },
  greentea: { th: 'ชาเขียว', en: 'Green tea', sci: 'Camellia sinensis' },
  cranberry: { th: 'แครนเบอร์รี่', en: 'Cranberry', sci: 'Vaccinium macrocarpon' },
  sawpalmetto: { th: 'ซอว์ปาลเมตโต', en: 'Saw palmetto', sci: 'Serenoa repens' },
  hawthorn: { th: 'ฮอว์ธอร์น', en: 'Hawthorn', sci: 'Crataegus oxyacantha' },
  garcinia: { th: 'ส้มแขก', en: 'Garcinia cambogia', sci: 'Garcinia cambogia' },
  kratom: { th: 'กระท่อม', en: 'Kratom', sci: 'Mitragyna speciosa' },
  butterflypea: { th: 'อัญชัน', en: 'Butterfly pea', sci: 'Clitoria ternatea' },
  roselle: { th: 'กระเจี๊ยบแดง', en: 'Roselle', sci: 'Hibiscus sabdariffa' },
  lemongrass: { th: 'ตะไคร้', en: 'Lemongrass', sci: 'Cymbopogon citratus' },
  pandan: { th: 'เตย', en: 'Pandan', sci: 'Pandanus amaryllifolius' },
  bittergourd: { th: 'มะระ / มะระขี้นก', en: 'Bitter gourd', sci: 'Momordica charantia' },
  holybasil: { th: 'กะเพรา', en: 'Holy basil', sci: 'Ocimum sanctum' },
  moringa: { th: 'มะรุม', en: 'Moringa', sci: 'Moringa oleifera' },
  gotukola: { th: 'บัวบก', en: 'Gotu kola', sci: 'Centella asiatica' },
  aloevera: { th: 'ว่านหางจระเข้', en: 'Aloe vera', sci: 'Aloe vera' },
  licorice: { th: 'ชะเอมเทศ', en: 'Licorice', sci: 'Glycyrrhiza glabra' },
  blackpepper: { th: 'พริกไทยดำ (พิเพอรีน)', en: 'Black pepper (Piperine)', sci: 'Piper nigrum' },
  safflower: { th: 'ดอกคำฝอย', en: 'Safflower', sci: 'Carthamus tinctorius' },
  danshen: { th: 'ตานเซิน', en: 'Danshen', sci: 'Salvia miltiorrhiza' },
  dongquai: { th: 'ตังกุย', en: 'Dong quai', sci: 'Angelica sinensis' },
  feverfew: { th: 'ฟีเวอร์ฟิว', en: 'Feverfew', sci: 'Tanacetum parthenium' },
  horsechestnut: { th: 'เกาลัดม้า', en: 'Horse chestnut', sci: 'Aesculus hippocastanum' },
  flaxseed: { th: 'เมล็ดแฟลกซ์ (เมล็ดลินิน)', en: 'Flaxseed', sci: 'Linum usitatissimum' },
  vitamin_e: { th: 'วิตามินอี', en: 'Vitamin E', sci: 'ไม่ระบุ' },
  vitamin_k: { th: 'วิตามินเค / อัลฟัลฟา', en: 'Vitamin K / Alfalfa', sci: 'ไม่ระบุ' },
  kava: { th: 'คาวา คาวา', en: 'Kava kava', sci: 'Piper methysticum' },
  redyeastrice: { th: 'ข้าวยีสต์แดง', en: 'Red yeast rice', sci: 'Monascus purpureus' },
  devilsclaw: { th: 'เดวิลส์คลอว์', en: "Devil's claw", sci: 'Harpagophytum procumbens' },
  fenugreek: { th: 'ลูกซัด', en: 'Fenugreek', sci: 'Trigonella foenum-graecum' },
  chamomile: { th: 'คาโมมายล์', en: 'Chamomile', sci: 'Matricaria chamomilla' },
  psyllium: { th: 'ไซเลียม (ใยอาหาร)', en: 'Psyllium', sci: 'Plantago ovata' },
  mango: { th: 'มะม่วง', en: 'Mango', sci: 'Mangifera indica' },
  grapefruit: { th: 'เกรปฟรุต / ส้มโอ', en: 'Grapefruit', sci: 'Citrus paradisi' },
}

// ---------------------------------------------------------------------------
// Interaction rows. Each row: { herb, drugs:[ids], effect, risk, evidence,
// symptoms, recommendation }. One JSON record is produced per (herb, drug).
// ---------------------------------------------------------------------------
const ROWS = [
  // 1. กระเทียม
  { herb: 'garlic', drugs: VKA, effect: 'เพิ่มความเสี่ยงเลือดออก (ฤทธิ์ต้านเกล็ดเลือด)', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดกำเดา, เหงือกเลือดออก, เลือดในอุจจาระ/ปัสสาวะ', recommendation: 'ปริมาณอาหารปกติความเสี่ยงต่ำ แต่หลีกเลี่ยงผลิตภัณฑ์เข้มข้น/อาหารเสริม' },
  { herb: 'garlic', drugs: ['aspirin', 'clopidogrel', 'ticagrelor', 'prasugrel'], effect: 'เพิ่มฤทธิ์ต้านเกล็ดเลือด', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดออกนาน', recommendation: 'ระวังกระเทียมเข้มข้น/อาหารเสริม' },
  { herb: 'garlic', drugs: DOAC, effect: 'เพิ่มความเสี่ยงเลือดออก', risk: 'medium', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ติดตามอาการเลือดออก' },

  // 2. ขิง
  { herb: 'ginger', drugs: VKA, effect: 'เพิ่ม INR / ความเสี่ยงเลือดออก', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'หลีกเลี่ยงขิงขนาดสูง รักษาปริมาณให้สม่ำเสมอ' },
  { herb: 'ginger', drugs: ['aspirin', 'clopidogrel'], effect: 'เพิ่มฤทธิ์ต้านเกล็ดเลือด', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย', recommendation: 'ระวัง' },
  { herb: 'ginger', drugs: ['nifedipine'], effect: 'เพิ่มฤทธิ์ยา', risk: 'medium', evidence: 'documented', symptoms: 'ความดันต่ำ, วิงเวียน', recommendation: 'ปรึกษาแพทย์' },

  // 3. ขมิ้นชัน
  { herb: 'turmeric', drugs: VKA, effect: 'เพิ่มระดับยา / ความเสี่ยงเลือดออก', risk: 'medium', evidence: 'documented', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ปริมาณอาหารความเสี่ยงต่ำ หลีกเลี่ยงแคปซูลขมิ้น ≥500 มก./วัน' },
  { herb: 'turmeric', drugs: ['clopidogrel'], effect: 'เพิ่มระดับยา', risk: 'medium', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ระวัง' },
  { herb: 'turmeric', drugs: ['losartan'], effect: 'เพิ่มระดับยา', risk: 'medium', evidence: 'theoretical', symptoms: 'ความดันต่ำ, วิงเวียน', recommendation: 'ปรึกษาแพทย์' },

  // 4. ฟ้าทะลายโจร
  { herb: 'andrographis', drugs: VKA, effect: 'เพิ่มระดับวาร์ฟาริน → ความเสี่ยงเลือดออก', risk: 'medium', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ระวัง / ติดตาม INR' },
  { herb: 'andrographis', drugs: ['enalapril', 'lisinopril', 'ramipril', 'losartan', 'valsartan', 'amlodipine', 'nifedipine'], effect: 'ลดความดันเพิ่มเติม', risk: 'low', evidence: 'theoretical', symptoms: 'ความดันต่ำ, วิงเวียน', recommendation: 'สังเกตอาการ' },

  // 5. แปะก๊วย
  { herb: 'ginkgo', drugs: VKA, effect: 'เพิ่มความเสี่ยงเลือดออก (ginkgolides ยับยั้ง platelet-activating factor)', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดกำเดา, เหงือกเลือดออก, เลือดในสมอง, เลือดในอุจจาระ/ปัสสาวะ', recommendation: 'หลีกเลี่ยงหรือติดตาม หยุดก่อนผ่าตัด 7-14 วัน' },
  { herb: 'ginkgo', drugs: ['aspirin', 'clopidogrel'], effect: 'เพิ่มฤทธิ์ต้านเกล็ดเลือด', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'เฝ้าระวังเลือดออก' },

  // 6. โสม
  { herb: 'ginseng', drugs: ['warfarin'], effect: 'อาจลดฤทธิ์วาร์ฟาริน (INR ลด → เสี่ยงเลือดอุดตัน); บางแหล่งระบุเสี่ยงเลือดออก', risk: 'medium', evidence: 'conflicting', symptoms: 'ขาบวม, เจ็บหน้าอก (อาการลิ่มเลือด) หรือ ช้ำง่าย, เลือดออก', recommendation: 'หลีกเลี่ยง/ติดตาม INR' },
  { herb: 'ginseng', drugs: ['amlodipine', 'losartan'], effect: 'เปลี่ยนระดับยา (เพิ่ม/ลด)', risk: 'medium', evidence: 'theoretical', symptoms: 'ความดันเปลี่ยนแปลง', recommendation: 'ใช้ระวัง' },

  // 7. น้ำมันปลา / โอเมก้า-3
  { herb: 'fishoil', drugs: ['warfarin', 'aspirin'], effect: 'เพิ่มฤทธิ์ต้านเกล็ดเลือด/ต้านการแข็งตัวเล็กน้อยเมื่อขนาดสูง', risk: 'medium', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดออกนาน', recommendation: '≤1 กรัม/วัน ความเสี่ยงต่ำ แจ้งแพทย์ถ้ากิน ≥3 กรัม/วัน' },

  // 8. CoQ10
  { herb: 'coq10', drugs: ['warfarin'], effect: 'อาจลดฤทธิ์วาร์ฟาริน (โครงสร้างคล้ายวิตามินเค) → เสี่ยงเลือดอุดตัน', risk: 'medium', evidence: 'documented', symptoms: 'ขาบวม, เจ็บหน้าอก (อาการลิ่มเลือด)', recommendation: 'ตรวจ INR ภายใน 2 สัปดาห์หลังเริ่ม/หยุด' },
  { herb: 'coq10', drugs: ['amlodipine', 'lisinopril', 'losartan', 'metoprolol', 'bisoprolol', 'carvedilol'], effect: 'ลดความดันเพิ่มเติมเล็กน้อย', risk: 'low', evidence: 'theoretical', symptoms: 'วิงเวียน, อ่อนเพลีย', recommendation: 'สังเกตอาการ' },

  // 9. มะขามแขก
  { herb: 'senna', drugs: ['digoxin'], effect: 'โพแทสเซียมต่ำจากยาระบาย → เพิ่มพิษดิจอกซิน', risk: 'high', evidence: 'documented', symptoms: 'คลื่นไส้, มองเห็นผิดปกติ (เห็นสีเหลือง/เขียว), ใจสั่น, หัวใจเต้นผิดจังหวะ', recommendation: 'หลีกเลี่ยงการใช้เรื้อรัง/ปริมาณสูง' },
  { herb: 'senna', drugs: ['furosemide', 'hctz'], effect: 'สูญเสียโพแทสเซียมเพิ่มเติม → ภาวะโพแทสเซียมต่ำ', risk: 'medium', evidence: 'documented', symptoms: 'กล้ามเนื้ออ่อนแรง, ตะคริว, ใจสั่น', recommendation: 'ระวัง' },
  { herb: 'senna', drugs: ['warfarin'], effect: 'ท้องเสีย → อาจเพิ่มฤทธิ์วาร์ฟาริน', risk: 'medium', evidence: 'theoretical', symptoms: 'เลือดออก', recommendation: 'สังเกตอาการ' },

  // 10. St John's wort
  { herb: 'stjohnswort', drugs: VKA, effect: 'ลดระดับวาร์ฟาริน (เหนี่ยวนำเอนไซม์ CYP/P-gp) → ยาไม่ออกฤทธิ์ → เสี่ยงลิ่มเลือด', risk: 'high', evidence: 'documented', symptoms: 'ขาบวม, เจ็บหน้าอก, อาการโรคหลอดเลือดสมอง', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'stjohnswort', drugs: DOAC, effect: 'ลดระดับยา → เสี่ยงลิ่มเลือด/โรคหลอดเลือดสมอง (ริวารอกซาแบน AUC ลด ~24%)', risk: 'high', evidence: 'documented', symptoms: 'ขาบวม, เจ็บหน้าอก, อาการโรคหลอดเลือดสมอง', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'stjohnswort', drugs: ['digoxin'], effect: 'ลดระดับดิจอกซิน → ควบคุมจังหวะหัวใจ/หัวใจล้มเหลวไม่ได้', risk: 'high', evidence: 'documented', symptoms: 'ใจสั่น, หัวใจเต้นเร็ว, หัวใจวาย', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'stjohnswort', drugs: ['simvastatin', 'atorvastatin'], effect: 'ลดระดับยา → ลดไขมันได้น้อยลง', risk: 'high', evidence: 'documented', symptoms: 'ไขมันสูงขึ้น (มักไม่มีอาการชัดเจน)', recommendation: 'หลีกเลี่ยง (ไม่กระทบพราวาสแตติน)' },
  { herb: 'stjohnswort', drugs: ['verapamil', 'nifedipine', 'amlodipine'], effect: 'ลดระดับยาอย่างมาก → ความดันไม่ลด (เวอราพามิล AUC ลด 78-80%)', risk: 'high', evidence: 'documented', symptoms: 'ความดันไม่ได้รับการควบคุม, ปวดหัว', recommendation: 'หลีกเลี่ยง' },

  // 11. Black cohosh
  { herb: 'blackcohosh', drugs: ['atorvastatin', 'simvastatin'], effect: 'เพิ่มความเสี่ยงตับอักเสบ; อาจลดการนำยาเข้าเซลล์ผ่าน OATP2B1', risk: 'medium', evidence: 'documented', symptoms: 'อ่อนเพลีย, ตัวเหลือง, ปัสสาวะเข้ม, ปวดท้อง; ลดไขมันได้น้อยลง', recommendation: 'ตรวจการทำงานของตับ' },
  { herb: 'blackcohosh', drugs: ['amiodarone'], effect: 'อาจลดการนำยาเข้าเซลล์/ประสิทธิภาพยา (OATP2B1)', risk: 'medium', evidence: 'theoretical', symptoms: 'ควบคุมจังหวะหัวใจได้น้อยลง', recommendation: 'ปรึกษาแพทย์' },

  // 12. ชาเขียว
  { herb: 'greentea', drugs: ['warfarin'], effect: 'วิตามินเคในชาเขียว → ลด INR (ต้านฤทธิ์วาร์ฟาริน) เมื่อดื่มปริมาณมาก → เสี่ยงลิ่มเลือด', risk: 'medium', evidence: 'documented', symptoms: 'อาการลิ่มเลือด (ขาบวม, เจ็บหน้าอก)', recommendation: 'ดื่มปริมาณปกติได้ รักษาให้สม่ำเสมอ หลีกเลี่ยงปริมาณมาก (>1 ลิตร/วัน)' },

  // 13. แครนเบอร์รี่
  { herb: 'cranberry', drugs: ['warfarin'], effect: 'อาจเพิ่ม INR / เสี่ยงเลือดออก', risk: 'low', evidence: 'conflicting', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ดื่ม ≤240 มล./วัน ความเสี่ยงต่ำ ระวังถ้า >1 ลิตร/วัน' },

  // 14. Saw palmetto
  { herb: 'sawpalmetto', drugs: ['warfarin', 'aspirin', 'rivaroxaban'], effect: 'เพิ่มความเสี่ยงเลือดออก (อาจมีผลต่อ CYP2C9/COX)', risk: 'medium', evidence: 'documented', symptoms: 'ช้ำง่าย, เลือดในปัสสาวะ, เลือดออก', recommendation: 'ระวัง/ติดตาม' },

  // 15. Hawthorn
  { herb: 'hawthorn', drugs: ['digoxin'], effect: 'ผลเสริมต่อหัวใจ (flavonoids โครงสร้างคล้าย) + รบกวนการตรวจวัดระดับดิจอกซิน', risk: 'medium', evidence: 'theoretical', symptoms: 'ใจสั่น, หัวใจเต้นผิดจังหวะ', recommendation: 'ใช้ภายใต้การดูแลของแพทย์หัวใจเท่านั้น' },
  { herb: 'hawthorn', drugs: ['amlodipine', 'lisinopril', 'metoprolol'], effect: 'เพิ่มผลลดความดัน/ผลต่อหัวใจ', risk: 'medium', evidence: 'theoretical', symptoms: 'ความดันต่ำ, วิงเวียน', recommendation: 'ปรึกษาแพทย์' },

  // 16. Garcinia cambogia
  { herb: 'garcinia', drugs: STATIN, effect: 'เพิ่มความเสี่ยงกล้ามเนื้อเสียหาย (rhabdomyolysis) + ตับอักเสบ', risk: 'medium', evidence: 'documented', symptoms: 'ปวดกล้ามเนื้อ, อ่อนแรง, ปัสสาวะเข้ม', recommendation: 'หลีกเลี่ยง' },
  { herb: 'garcinia', drugs: ['warfarin'], effect: 'ฤทธิ์ต้านเกล็ดเลือดเชิงทฤษฎี (Drugs.com ไม่พบปฏิกิริยาชัดเจน)', risk: 'low', evidence: 'theoretical', symptoms: 'ไม่ระบุ', recommendation: 'สังเกตอาการ' },

  // 17. กระท่อม
  { herb: 'kratom', drugs: ['amiodarone', 'digoxin'], effect: 'ทำให้ช่วง QT ยาวขึ้น (mitragynine ยับยั้งช่องโพแทสเซียม hERG) → หัวใจเต้นผิดจังหวะ', risk: 'high', evidence: 'documented', symptoms: 'ใจสั่น, เป็นลม, หัวใจเต้นผิดจังหวะ, ชัก, หัวใจหยุดเต้น', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'kratom', drugs: ['metoprolol', 'propranolol', 'carvedilol'], effect: 'ยับยั้งเอนไซม์ CYP2D6/3A4 → เพิ่มระดับยาในเลือด', risk: 'medium', evidence: 'theoretical', symptoms: 'หัวใจเต้นช้า, ความดันต่ำ, วิงเวียน, อ่อนเพลีย', recommendation: 'ระวัง' },
  { herb: 'kratom', drugs: ['amlodipine', 'lisinopril', 'losartan'], effect: 'อาจเพิ่มความดัน/หัวใจเต้นเร็ว (ฤทธิ์ alpha-2 adrenergic)', risk: 'medium', evidence: 'theoretical', symptoms: 'ความดันสูง, ใจสั่น, เหงื่อออก, ตัวสั่น', recommendation: 'ระวัง' },

  // 18. อัญชัน
  { herb: 'butterflypea', drugs: ['warfarin', 'aspirin', 'clopidogrel'], effect: 'ต้านเกล็ดเลือดเล็กน้อย → เลือดออกเพิ่ม', risk: 'medium', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออกนาน', recommendation: 'สังเกตอาการ' },
  { herb: 'butterflypea', drugs: ['lisinopril', 'amlodipine', 'losartan'], effect: 'ลดความดันเพิ่มเติม (ในสัตว์ทดลองยับยั้ง ACE คล้ายลิซิโนพริล)', risk: 'low', evidence: 'theoretical', symptoms: 'วิงเวียน, ความดันต่ำ', recommendation: 'สังเกตอาการ' },

  // 19. กระเจี๊ยบแดง
  { herb: 'roselle', drugs: ['lisinopril', 'enalapril', 'hctz', 'amlodipine', 'nifedipine'], effect: 'ลดความดันเพิ่มเติม (ออกฤทธิ์คล้าย ACE inhibitor และขับปัสสาวะอ่อนๆ)', risk: 'medium', evidence: 'documented', symptoms: 'วิงเวียน, ความดันต่ำ, เป็นลม', recommendation: 'ติดตามความดันโลหิต' },
  { herb: 'roselle', drugs: ['diclofenac'], effect: 'อาจเปลี่ยนการขับยา', risk: 'low', evidence: 'theoretical', symptoms: 'ไม่ระบุ', recommendation: 'สังเกตอาการ' },

  // 20. ตะไคร้
  { herb: 'lemongrass', drugs: ['losartan', 'amlodipine', 'lisinopril'], effect: 'ลดความดันเพิ่มเติม (ขยายหลอดเลือดผ่าน NO/prostanoid + ปิดกั้นช่องแคลเซียม)', risk: 'medium', evidence: 'documented', symptoms: 'ความดันต่ำ, วิงเวียน, หัวใจเต้นเร็วแบบ reflex', recommendation: 'สังเกตอาการ' },

  // 21. เตย -> ไม่มีข้อมูลปฏิกิริยา (อยู่ในรายการสมุนไพร แต่ไม่มี record => แสดงเป็น "ไม่พบข้อมูล")

  // 22. มะระ
  { herb: 'bittergourd', drugs: ['antidiabetic'], effect: 'น้ำตาลต่ำเพิ่มเติม (สาร charantin, polypeptide-p, vicine)', risk: 'medium', evidence: 'documented', symptoms: 'มือสั่น, เหงื่อออก, สับสน, หมดสติ (อาการน้ำตาลต่ำ)', recommendation: 'ติดตามน้ำตาลในเลือด' },
  { herb: 'bittergourd', drugs: ['amlodipine', 'losartan'], effect: 'ลดความดันเพิ่มเติมเล็กน้อย', risk: 'low', evidence: 'theoretical', symptoms: 'วิงเวียน', recommendation: 'สังเกตอาการ' },

  // 23. กะเพรา
  { herb: 'holybasil', drugs: ['warfarin', 'aspirin', 'clopidogrel'], effect: 'ต้านเกล็ดเลือด → เลือดออกนาน', risk: 'medium', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ระวัง' },
  { herb: 'holybasil', drugs: ['amlodipine', 'lisinopril'], effect: 'ลดความดันเพิ่มเติมเล็กน้อย', risk: 'medium', evidence: 'theoretical', symptoms: 'วิงเวียน', recommendation: 'สังเกตอาการ' },
  { herb: 'holybasil', drugs: ['antidiabetic'], effect: 'น้ำตาลต่ำเพิ่มเติม', risk: 'medium', evidence: 'theoretical', symptoms: 'อาการน้ำตาลต่ำ', recommendation: 'สังเกตอาการ' },

  // 24. มะรุม
  { herb: 'moringa', drugs: ['lisinopril', 'amlodipine', 'losartan', 'furosemide', 'hctz'], effect: 'ลดความดันเพิ่มเติม', risk: 'medium', evidence: 'documented', symptoms: 'วิงเวียน, ความดันต่ำ, เป็นลม', recommendation: 'ติดตามความดันโลหิต' },
  { herb: 'moringa', drugs: ['antidiabetic'], effect: 'น้ำตาลต่ำเพิ่มเติม', risk: 'medium', evidence: 'documented', symptoms: 'อาการน้ำตาลต่ำ', recommendation: 'ติดตามน้ำตาล' },
  { herb: 'moringa', drugs: ['levothyroxine'], effect: 'อาจลดประสิทธิภาพ (ดูดซึม + เปลี่ยน T4→T3)', risk: 'medium', evidence: 'theoretical', symptoms: 'ไม่ระบุ', recommendation: 'แยกเวลากินห่างกัน ~4 ชั่วโมง' },

  // 25. บัวบก
  { herb: 'gotukola', drugs: ['atorvastatin', 'simvastatin'], effect: 'ยับยั้งเอนไซม์ CYP (in-vitro) → อาจเพิ่มระดับยา (ความสำคัญทางคลินิกยังไม่ชัด)', risk: 'low', evidence: 'theoretical', symptoms: 'ผลข้างเคียงของยาเพิ่มขึ้น', recommendation: 'สังเกตอาการ' },
  { herb: 'gotukola', drugs: ['amlodipine', 'lisinopril'], effect: 'ลดความดันเล็กน้อย', risk: 'low', evidence: 'theoretical', symptoms: 'วิงเวียน', recommendation: 'สังเกตอาการ' },

  // 26. ว่านหางจระเข้
  { herb: 'aloevera', drugs: ['digoxin'], effect: 'น้ำยางว่านหางจระเข้ (ยาระบาย) → โพแทสเซียมต่ำ → เพิ่มพิษดิจอกซิน', risk: 'high', evidence: 'documented', symptoms: 'คลื่นไส้, มองเห็นผิดปกติ, ใจสั่น, หัวใจเต้นผิดจังหวะ', recommendation: 'หลีกเลี่ยงน้ำยางว่านฯ แบบกิน (เจลทาภายนอกปลอดภัย)' },
  { herb: 'aloevera', drugs: ['furosemide', 'hctz'], effect: 'สูญเสียโพแทสเซียมเพิ่มเติม → ภาวะโพแทสเซียมต่ำ', risk: 'medium', evidence: 'documented', symptoms: 'กล้ามเนื้ออ่อนแรง, ใจสั่น', recommendation: 'ระวัง' },
  { herb: 'aloevera', drugs: ['warfarin'], effect: 'ท้องเสีย → อาจเพิ่มฤทธิ์วาร์ฟาริน', risk: 'medium', evidence: 'theoretical', symptoms: 'เลือดออก', recommendation: 'สังเกตอาการ' },

  // 27. ชะเอมเทศ
  { herb: 'licorice', drugs: ['digoxin'], effect: 'สาร glycyrrhizin → โพแทสเซียมต่ำ → เพิ่มพิษดิจอกซิน (ช่วงการรักษาแคบ)', risk: 'high', evidence: 'documented', symptoms: 'คลื่นไส้, อาเจียน, มองเห็นผิดปกติ, หัวใจเต้นผิดจังหวะ', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'licorice', drugs: ['lisinopril', 'enalapril', 'amlodipine', 'losartan'], effect: 'โซเดียม/น้ำคั่ง → ความดันสูงขึ้น ต้านฤทธิ์ยา', risk: 'high', evidence: 'documented', symptoms: 'ความดันสูง, บวม, ปวดหัว', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'licorice', drugs: ['hctz', 'furosemide'], effect: 'สูญเสียโพแทสเซียมรุนแรง → ภาวะโพแทสเซียมต่ำ', risk: 'high', evidence: 'documented', symptoms: 'กล้ามเนื้ออ่อนแรง, ตะคริว, หัวใจเต้นผิดจังหวะ', recommendation: 'หลีกเลี่ยง' },
  { herb: 'licorice', drugs: ['warfarin'], effect: 'อาจลดฤทธิ์วาร์ฟาริน → เสี่ยงลิ่มเลือด', risk: 'medium', evidence: 'theoretical', symptoms: 'อาการลิ่มเลือด', recommendation: 'ติดตาม INR' },

  // 28. พริกไทยดำ / พิเพอรีน
  { herb: 'blackpepper', drugs: ['propranolol'], effect: 'piperine ยับยั้งการเผาผลาญยา → เพิ่มระดับยาในเลือด', risk: 'medium', evidence: 'theoretical', symptoms: 'ผลข้างเคียง/ฤทธิ์ยาเพิ่มขึ้น', recommendation: 'ระวังอาหารเสริมพิเพอรีน (ปริมาณอาหารปกติความเสี่ยงต่ำ)' },

  // 29. ดอกคำฝอย
  { herb: 'safflower', drugs: ['warfarin', 'aspirin', 'clopidogrel'], effect: 'ต้านการแข็งตัว + ต้านเกล็ดเลือด (safflower yellow/HSYA); เสริมฤทธิ์วาร์ฟาริน (เพิ่ม INR ในสัตว์)', risk: 'high', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออก, INR สูง', recommendation: 'ระวัง/ปรึกษาแพทย์' },

  // 30. ตานเซิน / Danshen
  { herb: 'danshen', drugs: VKA, effect: 'เพิ่มฤทธิ์ต้านการแข็งตัว เพิ่ม INR (tanshinones ยับยั้งการเผาผลาญวาร์ฟาริน) → เลือดออกรุนแรง', risk: 'high', evidence: 'documented', symptoms: 'ช้ำรุนแรง, เลือดในอุจจาระ/ปัสสาวะ', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'danshen', drugs: ['aspirin', 'clopidogrel'], effect: 'เพิ่มฤทธิ์ต้านเกล็ดเลือด', risk: 'high', evidence: 'documented', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'หลีกเลี่ยง' },

  // 31. ตังกุย / Dong quai
  { herb: 'dongquai', drugs: VKA, effect: 'มีสาร coumarin ≥6 ชนิด → เพิ่ม INR/เลือดออก; ลดการทำงานของเกล็ดเลือด', risk: 'high', evidence: 'documented', symptoms: 'ช้ำรุนแรง, เลือดออก', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },

  // 32. Feverfew
  { herb: 'feverfew', drugs: ['warfarin', 'aspirin', 'clopidogrel'], effect: 'ต้านเกล็ดเลือด (parthenolide ยับยั้งการเกาะกลุ่มเกล็ดเลือด) → เลือดออกเพิ่ม', risk: 'medium', evidence: 'theoretical', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'หยุดก่อนผ่าตัด 2 สัปดาห์' },

  // 33. Horse chestnut
  { herb: 'horsechestnut', drugs: ['warfarin', 'apixaban', 'rivaroxaban'], effect: 'สาร aescin/aesculin คล้าย coumarin → ต้านเกล็ดเลือด/ต้านการแข็งตัว → เลือดออก/เพิ่ม INR', risk: 'medium', evidence: 'theoretical', symptoms: 'เลือดออก/ช้ำผิดปกติ, วิงเวียน, อุจจาระดำหรือมีเลือด, ไอ/อาเจียนเป็นเลือด, ปวดหัวรุนแรง, อ่อนแรง', recommendation: 'ระวัง/ปรึกษาแพทย์' },

  // 34. เมล็ดแฟลกซ์
  { herb: 'flaxseed', drugs: ['warfarin'], effect: 'อาจรบกวนการดูดซึม (ลด INR) + omega-3 เพิ่มฤทธิ์ต้านเกล็ดเลือดเล็กน้อย', risk: 'medium', evidence: 'documented', symptoms: 'ผลแปรผัน', recommendation: 'แยกเวลากินจากวาร์ฟาริน' },

  // 35. อื่นๆ ที่มีปฏิกิริยากับวาร์ฟาริน (ตารางต้นทางไม่มีคอลัมน์ระดับหลักฐาน -> evidence: "")
  { herb: 'vitamin_e', drugs: ['warfarin'], effect: 'เพิ่ม INR / เลือดออก', risk: 'medium', evidence: '', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },
  { herb: 'vitamin_k', drugs: ['warfarin'], effect: 'ลด INR → เสี่ยงลิ่มเลือด', risk: 'medium', evidence: '', symptoms: 'อาการลิ่มเลือด (ขาบวม, เจ็บหน้าอก)', recommendation: 'รักษาปริมาณการบริโภคให้สม่ำเสมอ' },
  { herb: 'kava', drugs: ['warfarin'], effect: 'เพิ่ม INR', risk: 'medium', evidence: '', symptoms: 'เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },
  { herb: 'redyeastrice', drugs: ['warfarin'], effect: 'เพิ่ม INR', risk: 'medium', evidence: '', symptoms: 'เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },
  { herb: 'redyeastrice', drugs: STATIN, effect: 'มีฤทธิ์คล้ายสแตติน → เสริมฤทธิ์ต่อกล้ามเนื้อ/ตับ', risk: 'medium', evidence: '', symptoms: 'ปวดกล้ามเนื้อ, อ่อนแรง', recommendation: 'หลีกเลี่ยงการใช้ร่วมกับสแตติน' },
  { herb: 'devilsclaw', drugs: ['warfarin'], effect: 'อาจเพิ่ม INR/เลือดออก (มีสาร coumarin)', risk: 'medium', evidence: '', symptoms: 'เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },
  { herb: 'fenugreek', drugs: ['warfarin'], effect: 'อาจเพิ่ม INR/เลือดออก (มีสาร coumarin)', risk: 'medium', evidence: '', symptoms: 'เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },
  { herb: 'chamomile', drugs: ['warfarin'], effect: 'อาจเพิ่ม INR/เลือดออก (มีสาร coumarin)', risk: 'medium', evidence: '', symptoms: 'เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },
  { herb: 'psyllium', drugs: ['warfarin'], effect: 'รบกวนการดูดซึมวาร์ฟาริน', risk: 'medium', evidence: '', symptoms: 'ผลแปรผัน', recommendation: 'แยกเวลากินจากวาร์ฟาริน' },
  { herb: 'mango', drugs: ['warfarin'], effect: 'อาจเพิ่ม INR แบบคาดเดาไม่ได้', risk: 'medium', evidence: '', symptoms: 'ช้ำง่าย, เลือดออก', recommendation: 'ระวัง/ปรึกษาแพทย์' },

  // เกรปฟรุต/ส้มโอ (ผลไม้ที่สำคัญในอาหารไทย)
  { herb: 'grapefruit', drugs: ['simvastatin', 'atorvastatin'], effect: 'เพิ่มระดับยามาก → กล้ามเนื้อเสียหาย/rhabdomyolysis', risk: 'high', evidence: 'documented', symptoms: 'ปวดกล้ามเนื้อ, อ่อนแรง, ปัสสาวะเข้ม', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'grapefruit', drugs: ['felodipine', 'nifedipine'], effect: 'เพิ่มระดับยา → ความดันต่ำ', risk: 'high', evidence: 'documented', symptoms: 'วิงเวียน, เป็นลม', recommendation: 'หลีกเลี่ยง/ปรึกษาแพทย์' },
  { herb: 'grapefruit', drugs: ['amiodarone'], effect: 'เพิ่มระดับยาอย่างมาก (AUC เพิ่ม 50%, Cmax เพิ่ม 84%)', risk: 'high', evidence: 'documented', symptoms: 'หัวใจเต้นผิดจังหวะ, ผลข้างเคียงรุนแรง', recommendation: 'หลีกเลี่ยงการใช้ร่วม' },
  { herb: 'grapefruit', drugs: ['losartan'], effect: 'ลดประสิทธิภาพ → ควบคุมความดันได้น้อยลง', risk: 'medium', evidence: 'documented', symptoms: 'ความดันสูง', recommendation: 'ติดตามความดันโลหิต' },
]

// ---------------------------------------------------------------------------
// Expand rows -> interaction records
// ---------------------------------------------------------------------------
const RISK_VALUES = new Set(['high', 'medium', 'low', 'unknown'])
const EVIDENCE_VALUES = new Set(['documented', 'conflicting', 'theoretical', ''])

const interactions = []
let id = 1
const usedDrugIds = new Set()
const usedHerbIds = new Set()

for (const row of ROWS) {
  const herb = HERBS[row.herb]
  if (!herb) throw new Error(`Unknown herb id: ${row.herb}`)
  usedHerbIds.add(row.herb)
  if (!RISK_VALUES.has(row.risk)) throw new Error(`Bad risk "${row.risk}" for ${row.herb}`)
  if (!EVIDENCE_VALUES.has(row.evidence)) throw new Error(`Bad evidence "${row.evidence}" for ${row.herb}`)

  for (const drugId of row.drugs) {
    const drug = DRUGS[drugId]
    if (!drug) throw new Error(`Unknown drug id: ${drugId} (herb ${row.herb})`)
    usedDrugIds.add(drugId)
    interactions.push({
      id: id++,
      herb_th: herb.th,
      herb_en: herb.en,
      herb_sci: herb.sci || 'ไม่ระบุ',
      drug_th: drug.th,
      drug_en: drug.en,
      drug_class: drug.class,
      effect: row.effect || 'ไม่ระบุ',
      risk_level: row.risk,
      evidence: row.evidence,
      symptoms: row.symptoms || 'ไม่ระบุ',
      recommendation: row.recommendation || 'ไม่ระบุ',
    })
  }
}

// ---------------------------------------------------------------------------
// Master lists (drugs.json, herbs.json) — include ALL master entries so that
// dropdowns offer the full known set (incl. herbs with no documented pair,
// e.g. เตย, which then surface as "no data" in the checker).
// ---------------------------------------------------------------------------
const drugsMaster = Object.entries(DRUGS).map(([key, d]) => ({
  id: key,
  th: d.th,
  en: d.en,
  class: d.class,
}))

const herbsMaster = Object.entries(HERBS).map(([key, h]) => ({
  id: key,
  th: h.th,
  en: h.en,
  sci: h.sci || 'ไม่ระบุ',
}))

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------
mkdirSync(dataDir, { recursive: true })
const write = (name, obj) =>
  writeFileSync(join(dataDir, name), JSON.stringify(obj, null, 2) + '\n', 'utf8')

write('interactions.json', interactions)
write('drugs.json', drugsMaster)
write('herbs.json', herbsMaster)

console.log(`interactions.json : ${interactions.length} records`)
console.log(`drugs.json        : ${drugsMaster.length} drugs (${usedDrugIds.size} referenced)`)
console.log(`herbs.json        : ${herbsMaster.length} herbs (${usedHerbIds.size} with interactions)`)
const highCount = interactions.filter((i) => i.risk_level === 'high').length
console.log(`high-risk records : ${highCount}`)
