import { useState } from 'react'
import { initials } from '../../lib/utils'
import { classNames } from '../../lib/utils'

interface CompanyMarkProps {
  name: string
  logo?: string
  size?: number
  className?: string
}

export function CompanyMark({ name, logo, size = 40, className }: CompanyMarkProps) {
  const [failed, setFailed] = useState(false)

  if (logo && !failed) {
    return (
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        className={classNames('rounded-xl object-cover shrink-0 border border-[#EAEDF1]', className)}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span
      className={classNames(
        'rounded-xl text-white font-bold flex items-center justify-center shrink-0 tracking-wide bg-[#1677FF]',
        className
      )}
      style={{ width: size, height: size, fontSize: size > 36 ? 13 : 11 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
