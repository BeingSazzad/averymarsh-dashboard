import { classNames } from '../../lib/utils'

interface BadgeProps {
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'slate'
  children: string
}

export function Badge({ tone = 'slate', children }: BadgeProps) {
  const styles = {
    blue: 'bg-[#EAF3FF] text-[#1677FF]',
    green: 'bg-[#E9F9F3] text-[#10A976]',
    amber: 'bg-[#FFF7E6] text-[#D97706]',
    red: 'bg-[#FFF0F0] text-[#E5484D]',
    slate: 'bg-[#EAEDF1] text-[#68707C]',
  }[tone]

  return (
    <span className={classNames('inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold', styles)}>
      {children}
    </span>
  )
}
