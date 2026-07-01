import { ShieldPlus, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-brand-800 text-brand-50">
      {/* faint dotted texture */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <ShieldPlus size={20} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="font-bold">ระบบคัดกรองยา-สมุนไพร</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90">
            เครื่องมือคัดกรองอันตรกิริยาระหว่างยาหัวใจและสมุนไพรสำหรับผู้ป่วยโรคหัวใจชาวไทย
            เพื่อการศึกษาและคัดกรองเบื้องต้น
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-200">
            คำเตือน
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90">
            ข้อมูลนี้ไม่ทดแทนคำแนะนำของแพทย์หรือเภสัชกร
            การไม่พบคู่ยา-สมุนไพรในฐานข้อมูลไม่ได้แปลว่าปลอดภัย
            ควรปรึกษาผู้เชี่ยวชาญก่อนใช้ร่วมกันเสมอ
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-200">
            แหล่งข้อมูล
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-brand-100/90">
            <li>Tan &amp; Lee 2021 (Br J Clin Pharmacol)</li>
            <li>Choi et al. 2017 (PLoS One)</li>
            <li>UC San Diego Health, Bumrungrad Hospital</li>
            <li>Memorial Sloan Kettering Integrative Medicine</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-brand-100/80 sm:flex-row">
          <p>ระบบคัดกรองอันตรกิริยาระหว่างยาและสมุนไพรสำหรับผู้ป่วยโรคหัวใจ</p>
          <p className="inline-flex items-center gap-1.5">
            จัดทำเพื่อการศึกษา
            <Heart size={13} className="text-brand-300" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  )
}
