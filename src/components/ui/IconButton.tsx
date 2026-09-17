import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'neutral' | 'blue' | 'danger'
  label: string
  children: ReactNode
}

export function IconButton({ tone = 'neutral', label, className, children, ...props }: IconButtonProps) {
  const styles = {
    neutral: 'text-[#68707C] border-[#DDE1E7] hover:bg-[#F2F2F7] hover:text-[#171A1F]',
    blue: 'text-[#1677FF] border-[#B7D4FF] bg-[#EAF3FF] hover:bg-[#DCECFF]',
    danger: 'text-[#E5484D] border-[#F4C7C7] hover:bg-[#FFF0F0]',
  }[tone]

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={classNames(
        'w-8 h-8 rounded-lg border inline-flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        styles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
