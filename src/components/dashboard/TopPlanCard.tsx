import { money } from '../../lib/utils'

interface TopPlanCardProps {
  name: string
  count: number
  total: number
  price?: number
}

export function TopPlanCard({ name, count, total, price }: TopPlanCardProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const size = 168
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="panel p-5 md:p-6 fade-up h-full flex flex-col">
      <h2 className="text-lg font-bold text-[#171A1F] tracking-tight">Top plan</h2>
      <p className="text-xs text-[#68707C] mt-1">Most used subscription</p>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#EAEDF1"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#1677FF"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-[28px] font-bold text-[#171A1F] tabular-nums leading-none tracking-tight">
              {pct}%
            </p>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-1.5 uppercase tracking-wide">
              of companies
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-base font-bold text-[#171A1F]">{name || '—'}</p>
          <p className="text-xs text-[#68707C] mt-1">
            {count} of {total} companies
            {typeof price === 'number' ? ` · ${money(price)}/mo` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
