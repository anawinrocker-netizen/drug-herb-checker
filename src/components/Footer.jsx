import { ShieldPlus, Heart, Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-b from-brand-800 to-brand-900 text-brand-50">
      {/* gold hairline at the top */}
      <span
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
        aria-hidden="true"
      />
      {/* faint dotted texture */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
      {/* oversized watermark leaves */}
      <Leaf
        size={220}
        className="pointer-events-none absolute -left-14 -top-10 rotate-[24deg] text-white/[0.04]"
        aria-hidden="true"
      />
      <Leaf
        size={170}
        className="pointer-events-none absolute -bottom-12 right-8 -rotate-[18deg] text-gold-400/[0.06]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold-300 ring-1 ring-gold-400/40">
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
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">
            คำเตือน
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-100/90">
            ข้อมูลนี้ไม่ทดแทนคำแนะนำของแพทย์หรือเภสัชกร
            การไม่พบคู่ยา-สมุนไพรในฐานข้อมูลไม่ได้แปลว่าปลอดภัย
            ควรปรึกษาผู้เชี่ยวชาญก่อนใช้ร่วมกันเสมอ
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">
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

      <div className="relative border-t border-gold-400/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-brand-100/80 sm:flex-row">
          <p>ระบบคัดกรองอันตรกิริยาระหว่างยาและสมุนไพรสำหรับผู้ป่วยโรคหัวใจ</p>
          <p className="inline-flex items-center gap-1.5">
            จัดทำเพื่อการศึกษา
            <Heart size={13} className="text-gold-400" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  )
}
