import { Ban } from 'lucide-react'
import { Button } from '../ui/Button'

interface SuspendConfirmProps {
  companyName: string
  people: number
  onCancel: () => void
  onConfirm: () => void
}

export function SuspendConfirm({ companyName, people, onCancel, onConfirm }: SuspendConfirmProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-2xl bg-[#FFF0F0] text-[#E5484D] flex items-center justify-center shrink-0">
          <Ban className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#171A1F]">Ban this company?</p>
          <p className="text-sm text-[#68707C] mt-1 leading-relaxed">
            <span className="font-semibold text-[#171A1F]">{companyName}</span>
            {people > 0 ? ` · ${people} people` : ''}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#F4C7C7] bg-[#FFF8F8] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#E5484D] mb-2">What happens</p>
        <ul className="flex flex-col gap-1.5 text-sm text-[#171A1F]">
          <li className="flex gap-2">
            <span className="text-[#E5484D] shrink-0">•</span>
            All users lose access immediately
          </li>
          <li className="flex gap-2">
            <span className="text-[#E5484D] shrink-0">•</span>
            Subscription pauses and MRR stops
          </li>
          <li className="flex gap-2">
            <span className="text-[#E5484D] shrink-0">•</span>
            Company data stays — you can restore later
          </li>
        </ul>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Ban company
        </Button>
      </div>
    </div>
  )
}
