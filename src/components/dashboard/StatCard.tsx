interface StatCardProps {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#DDE1E7] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#68707C]">{label}</p>
      <p className="text-2xl font-bold text-[#171A1F] mt-1 tracking-tight">{value}</p>
      {hint ? <p className="text-xs text-[#68707C] mt-1">{hint}</p> : null}
    </div>
  )
}
