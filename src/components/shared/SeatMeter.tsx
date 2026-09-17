interface SeatMeterProps {
  people: number
  seats: number
}

export function SeatMeter({ people, seats }: SeatMeterProps) {
  const pct = seats > 0 ? Math.min(100, Math.round((people / seats) * 100)) : 0
  const hot = pct >= 90
  return (
    <div className="min-w-[140px]">
      <p className="text-sm font-bold text-[#171A1F] tabular-nums leading-none">
        {people}
        <span className="font-medium text-[#68707C]"> / {seats}</span>
        <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
          seats
        </span>
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-[#EAEDF1] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${hot ? 'bg-[#D97706]' : 'bg-[#1677FF]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
