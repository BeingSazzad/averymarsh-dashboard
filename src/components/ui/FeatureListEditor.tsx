import { Plus, Trash2 } from 'lucide-react'
import { Button } from './Button'

interface FeatureListEditorProps {
  label?: string
  value: string[]
  onChange: (features: string[]) => void
  max?: number
}

export function FeatureListEditor({
  label = 'Benefits',
  value,
  onChange,
  max = 5,
}: FeatureListEditorProps) {
  const rows = value.length > 0 ? value : ['']

  const updateAt = (index: number, next: string) => {
    const copy = [...rows]
    copy[index] = next
    onChange(copy)
  }

  const removeAt = (index: number) => {
    const copy = rows.filter((_, i) => i !== index)
    onChange(copy.length ? copy : [''])
  }

  const addRow = () => {
    if (rows.length >= max) return
    onChange([...rows, ''])
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#171A1F]">{label}</span>
        <span className="text-[11px] font-medium text-[#94A3B8]">
          {rows.filter((row) => row.trim()).length}/{max}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={row}
              onChange={(e) => updateAt(index, e.target.value)}
              placeholder={`Benefit ${index + 1}`}
              className="flex-1 h-11 rounded-xl border border-[#DDE1E7] bg-white px-3.5 text-sm text-[#171A1F] outline-none focus:border-[#1677FF] placeholder:text-[#94A3B8]"
            />
            <button
              type="button"
              aria-label="Remove benefit"
              onClick={() => removeAt(index)}
              disabled={rows.length <= 1 && !row.trim()}
              className="w-11 h-11 rounded-xl border border-[#DDE1E7] text-[#68707C] hover:bg-[#FFF0F0] hover:text-[#E5484D] hover:border-[#F4C7C7] inline-flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="self-start"
        disabled={rows.length >= max}
        onClick={addRow}
      >
        <Plus className="w-3.5 h-3.5" />
        Add benefit
      </Button>
    </div>
  )
}
