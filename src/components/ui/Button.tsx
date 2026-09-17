import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-[#1677FF] text-white hover:bg-[#0F5FD7]',
    secondary: 'bg-white text-[#171A1F] border border-[#DDE1E7] hover:bg-[#F2F2F7]',
    ghost: 'bg-transparent text-[#68707C] hover:bg-[#EAEDF1] hover:text-[#171A1F]',
    danger: 'bg-white text-[#E5484D] border border-[#F4C7C7] hover:bg-[#FFF0F0]',
  }[variant]

  return (
    <button
      className={classNames(
        'h-10 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        styles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
