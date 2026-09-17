import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 min-h-10 fade-up">
      <div className="min-w-0">
        <h1 className="text-[22px] font-bold text-[#171A1F] tracking-tight leading-none">{title}</h1>
        {subtitle ? <p className="text-sm text-[#68707C] mt-1.5 leading-snug">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
