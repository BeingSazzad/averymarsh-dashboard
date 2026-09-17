import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#DDE1E7] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#171A1F]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
