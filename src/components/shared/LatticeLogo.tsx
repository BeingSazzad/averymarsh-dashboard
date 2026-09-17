import { useId } from 'react'
import { classNames } from '../../lib/utils'

interface LatticeLogoProps {
  size?: 'sm' | 'md'
  wordmark?: boolean
  className?: string
}

const sizes = {
  sm: 28,
  md: 36,
}

export function LatticeLogo({ size = 'sm', wordmark = true, className }: LatticeLogoProps) {
  const raw = useId().replace(/:/g, '')
  const top = `lg-top-${raw}`
  const bottom = `lg-bot-${raw}`
  const px = sizes[size]

  return (
    <div className={classNames('inline-flex items-center gap-2.5 select-none', className)}>
      <svg width={px} height={px} viewBox="0 0 100 100" fill="none" aria-hidden className="shrink-0">
        <defs>
          <linearGradient id={top} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient id={bottom} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0055EE" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>
        </defs>
        <rect x="32" y="18" width="54" height="18" rx="9" transform="rotate(-26 32 18)" fill={`url(#${top})`} />
        <rect x="44" y="48" width="54" height="18" rx="9" transform="rotate(-26 44 48)" fill={`url(#${bottom})`} />
      </svg>
      {wordmark ? (
        <span className="text-base font-extrabold tracking-[0.16em] text-[#171A1F] leading-none">
          LATTICE
        </span>
      ) : null}
    </div>
  )
}
