import { ShieldAlert } from 'lucide-react'

// Persistent screening disclaimer. `variant` controls emphasis.
export default function Disclaimer({ variant = 'default', className = '' }) {
  const tone =
    variant === 'subtle'
      ? 'border-brand-100 bg-brand-50/60 text-ink-soft'
      : 'border-amber-200 bg-amber-50 text-amber-900'

  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${tone} ${className}`}
    >
      <ShieldAlert
        size={20}
        strokeWidth={2}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <p>
        ระบบนี้เป็นเครื่องมือคัดกรองเบื้องต้นเพื่อการศึกษาเท่านั้น
        ไม่ทดแทนการวินิจฉัยหรือคำแนะนำของแพทย์และเภสัชกร
        ผู้ใช้ยาวาร์ฟารินควรตรวจ INR สม่ำเสมอ
        และไม่ควรเริ่ม หยุด หรือเปลี่ยนยา/สมุนไพรเองโดยไม่ปรึกษาผู้เชี่ยวชาญ
      </p>
    </div>
  )
}
