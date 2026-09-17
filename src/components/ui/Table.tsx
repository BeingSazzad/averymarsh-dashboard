import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { classNames } from '../../lib/utils'

export function Table({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="panel overflow-hidden fade-up">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">{children}</table>
      </div>
      {footer}
    </div>
  )
}

export function Th({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={classNames(
        'px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] bg-[#F8FAFC] whitespace-nowrap border-b border-[#EAEDF1]',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function Td({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={classNames('px-4 py-4 align-middle border-t border-[#EAEDF1]', className)} {...props}>
      {children}
    </td>
  )
}
