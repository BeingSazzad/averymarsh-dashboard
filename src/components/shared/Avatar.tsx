interface AvatarProps {
  src: string
  name: string
  size?: number
}

export function Avatar({ src, name, size = 36 }: AvatarProps) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover border border-[#DDE1E7] shrink-0"
      style={{ width: size, height: size }}
    />
  )
}
