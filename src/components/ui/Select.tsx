import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      {label ? <span className="text-xs font-semibold text-[#171A1F]">{label}</span> : null}
      <span className="relative block">
        <select
          className={classNames(
            'w-full h-11 appearance-none rounded-xl border border-[#DDE1E7] bg-white pl-3.5 pr-11 text-sm text-[#171A1F] outline-none focus:border-[#1677FF] cursor-pointer',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68707C]" />
      </span>
    </label>
  )
}
