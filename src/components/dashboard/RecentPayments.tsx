import { Link } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { invoiceTone } from '../../lib/status'
import { formatDate, money } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'
import { Badge } from '../shared/Badge'

export function RecentPayments() {
  const invoices = useAppSelector((state) => state.platform.invoices)
  const companies = useAppSelector((state) => state.platform.companies)

  return (
    <div className="panel p-5 h-full fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#171A1F]">Latest payments</h2>
            <p className="text-[11px] text-[#68707C]">Recent subscription invoices</p>
          </div>
        </div>
        <Link to={ROUTES.billing} className="text-xs font-semibold text-[#1677FF] hover:underline">
          Billing
        </Link>
      </div>

      <ul className="flex flex-col">
        {invoices.slice(0, 5).map((invoice) => (
          <li
            key={invoice.id}
            className="py-3.5 border-t border-[#EAEDF1] first:border-t-0 first:pt-0 last:pb-0 flex items-center gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#171A1F] truncate">
                {companies.find((company) => company.id === invoice.companyId)?.name ?? invoice.id}
              </p>
              <p className="text-xs text-[#68707C] mt-0.5">
                {invoice.id} · {formatDate(invoice.date)}
              </p>
            </div>
            <p className="text-sm font-bold tabular-nums text-[#171A1F]">{money(invoice.amount)}</p>
            <Badge tone={invoiceTone(invoice.status)}>{invoice.status}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
