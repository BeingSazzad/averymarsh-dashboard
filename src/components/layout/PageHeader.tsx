import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-[#171A1F] tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-[#68707C] mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}
