import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { classNames } from '../../lib/utils'

const fieldClass =
  'w-full h-11 rounded-xl border border-[#DDE1E7] bg-white px-3.5 text-sm text-[#171A1F] outline-none focus:border-[#1677FF] placeholder:text-[#94A3B8]'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      {label ? <span className="text-xs font-semibold text-[#171A1F]">{label}</span> : null}
      <input id={id} className={classNames(fieldClass, className)} {...props} />
    </label>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function TextArea({ label, className, ...props }: TextAreaProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      {label ? <span className="text-xs font-semibold text-[#171A1F]">{label}</span> : null}
      <textarea
        className={classNames(
          'w-full min-h-[140px] rounded-xl border border-[#DDE1E7] bg-white p-3.5 text-sm text-[#171A1F] outline-none focus:border-[#1677FF] resize-y',
          className
        )}
        {...props}
      />
    </label>
  )
}
