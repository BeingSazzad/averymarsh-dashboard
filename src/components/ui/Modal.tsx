import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({ title, open, onClose, children, wide }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171A1F]/40 backdrop-blur-[2px]">
      <div
        className={`w-full rounded-[22px] bg-white border border-[#DDE1E7] p-5 shadow-[0_24px_60px_rgba(23,26,31,0.16)] ${
          wide ? 'max-w-lg' : 'max-w-md'
        }`}
      >
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] flex items-center justify-center cursor-pointer hover:bg-[#EAEDF1]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
