import type { ReactNode } from 'react'
import { classNames } from '../../lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  accent?: 'blue' | 'ink' | 'amber'
}

export function StatCard({ label, value, hint, icon, accent = 'blue' }: StatCardProps) {
  const iconTone = {
    blue: 'bg-[#EAF3FF] text-[#1677FF]',
    ink: 'bg-[#EAEDF1] text-[#171A1F]',
    amber: 'bg-[#FFF7E6] text-[#D97706]',
  }[accent]

  return (
    <div className="panel panel-hover p-5 flex gap-3.5 items-start fade-up">
      {icon ? (
        <span className={classNames('w-10 h-10 rounded-2xl flex items-center justify-center shrink-0', iconTone)}>
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
        <p className="text-[28px] leading-none font-bold text-[#171A1F] mt-2 tracking-tight tabular-nums">{value}</p>
        {hint ? <p className="text-xs text-[#68707C] mt-2 leading-snug">{hint}</p> : null}
      </div>
    </div>
  )
}
