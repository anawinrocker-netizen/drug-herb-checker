import { useState, useMemo, useRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Search } from 'lucide-react'

// Generic multi-select with Thai+English autocomplete and animated chips.
// `options`: array of master items {id, th, en, ...}
// `selected`: array of selected items
// `onChange`: (nextSelected) => void
export default function MultiSelectInput({
  label,
  icon: Icon,
  options,
  selected,
  onChange,
  placeholder = 'พิมพ์เพื่อค้นหา...',
  accentClass = 'text-brand-700',
}) {
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const listId = useId()

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return options
      .filter(
        (o) =>
          !selectedIds.has(o.id) &&
          (o.th.toLowerCase().includes(q) || o.en.toLowerCase().includes(q))
      )
      .slice(0, 8)
  }, [query, options, selectedIds])

  function add(item) {
    if (!item || selectedIds.has(item.id)) return
    onChange([...selected, item])
    setQuery('')
    setHighlight(0)
    inputRef.current?.focus()
  }

  function remove(id) {
    onChange(selected.filter((s) => s.id !== id))
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (matches[highlight]) add(matches[highlight])
    } else if (e.key === 'Backspace' && !query && selected.length) {
      remove(selected[selected.length - 1].id)
    }
  }

  const showList = focused && matches.length > 0

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
        {Icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-gold-50 ring-1 ring-gold-300/40">
            <Icon size={16} className={accentClass} aria-hidden="true" />
          </span>
        ) : null}
        {label}
      </label>

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-brand-200 bg-white p-2.5 shadow-soft transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-300">
          <AnimatePresence initial={false}>
            {selected.map((item) => (
              <motion.span
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-800"
              >
                {item.th}
                <button
                  type="button"
                  aria-label={`ลบ ${item.th}`}
                  onClick={() => remove(item.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-brand-600 transition-colors hover:bg-brand-200/70 hover:text-brand-900"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </motion.span>
            ))}

            <div className="flex min-w-[8rem] flex-1 items-center gap-2 px-1">
              <Search size={16} className="shrink-0 text-ink-soft" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={showList}
                aria-controls={listId}
                aria-autocomplete="list"
                value={query}
                placeholder={selected.length ? '' : placeholder}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setHighlight(0)
                }}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                className="w-full bg-transparent py-1 text-sm text-ink outline-none placeholder:text-ink-soft"
              />
            </div>
          </AnimatePresence>
        </div>

        {/* Autocomplete dropdown */}
        <AnimatePresence>
          {showList ? (
            <motion.ul
              id={listId}
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-brand-100 bg-white p-1.5 shadow-lift"
            >
              {matches.map((o, i) => (
                <li key={o.id} role="option" aria-selected={i === highlight}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(o)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      i === highlight ? 'bg-brand-50' : 'hover:bg-brand-50/60'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="font-medium text-ink">{o.th}</span>
                      <span className="ml-2 text-xs text-ink-soft">{o.en}</span>
                      {o.class ? (
                        <span className="block truncate text-xs text-ink-soft/80">{o.class}</span>
                      ) : null}
                    </span>
                    <Plus size={16} className="shrink-0 text-brand-600" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
