// Decorative curved SVG divider between sections.
// `flip` mirrors it vertically; `color` is the fill (the wave color).
export default function WaveDivider({ color = '#FFFFFF', flip = false, className = '' }) {
  return (
    <div className={`pointer-events-none -mb-px leading-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-[60px] w-full"
        style={flip ? { transform: 'scaleY(-1)' } : undefined}
      >
        <path
          fill={color}
          d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}
