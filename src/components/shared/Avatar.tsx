import { useState } from 'react'
import { initials } from '../../lib/utils'

interface AvatarProps {
  src: string
  name: string
  size?: number
}

export function Avatar({ src, name, size = 36 }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span
        className="rounded-full bg-[#EAF3FF] text-[#1677FF] font-bold flex items-center justify-center shrink-0"
        style={{ width: size, height: size, fontSize: size > 40 ? 16 : 12 }}
      >
        {initials(name)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  )
}
