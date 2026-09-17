import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  hint?: string
}

export function PasswordField({ label, hint, className, id, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-semibold text-[#171A1F]">{label}</span>
      <span className="relative block">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={props.autoComplete ?? 'current-password'}
          className={classNames(
            'w-full h-11 rounded-xl border border-[#DDE1E7] bg-white pl-3.5 pr-11 text-sm text-[#171A1F] outline-none focus:border-[#1677FF] placeholder:text-[#94A3B8]',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#68707C] hover:bg-[#F2F2F7] hover:text-[#171A1F] cursor-pointer"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </span>
      {hint ? <span className="text-[11px] text-[#68707C]">{hint}</span> : null}
    </label>
  )
}
