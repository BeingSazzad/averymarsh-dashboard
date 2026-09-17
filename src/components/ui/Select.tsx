import type { SelectHTMLAttributes } from 'react'
import { classNames } from '../../lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      {label ? <span className="text-xs font-semibold text-[#171A1F]">{label}</span> : null}
      <select
        className={classNames(
          'w-full h-11 rounded-xl border border-[#DDE1E7] bg-white px-3.5 text-sm text-[#171A1F] outline-none focus:border-[#1677FF]',
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
    </label>
  )
}
