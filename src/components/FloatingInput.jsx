import { useState } from 'react'

// Premium input with floating label: the label sits inside the field and
// glides up when focused or filled. Border glows green→gold on focus.
export default function FloatingInput({
  id,
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required,
}) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div
      className={`relative rounded-2xl border bg-white/80 shadow-soft backdrop-blur-sm transition-all duration-300 ${
        focused
          ? 'border-gold-400/80 shadow-glow'
          : 'border-brand-200 hover:border-brand-300'
      }`}
    >
      {Icon ? (
        <Icon
          size={18}
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            focused ? 'text-gold-500' : 'text-ink-soft'
          }`}
          aria-hidden="true"
        />
      ) : null}

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-11 transition-all duration-200 ${
          active
            ? 'top-1.5 text-[11px] font-semibold text-brand-600'
            : 'top-1/2 -translate-y-1/2 text-sm text-ink-soft'
        }`}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent pb-2 pl-11 pr-4 pt-6 text-sm text-ink outline-none"
      />
    </div>
  )
}
