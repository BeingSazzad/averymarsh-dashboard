import { initials } from '../../lib/utils'
import { classNames } from '../../lib/utils'

interface CompanyMarkProps {
  name: string
  size?: number
  className?: string
}

const accents = ['#1677FF', '#0F5FD7', '#0EA5E9', '#334155', '#475569']

export function CompanyMark({ name, size = 40, className }: CompanyMarkProps) {
  const tone = accents[name.length % accents.length]
  return (
    <span
      className={classNames(
        'rounded-xl text-white font-bold flex items-center justify-center shrink-0 tracking-wide',
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size > 36 ? 13 : 11,
        background: `linear-gradient(145deg, ${tone}, #0B1220)`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
