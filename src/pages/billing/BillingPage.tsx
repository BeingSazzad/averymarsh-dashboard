import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { money } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'
import type { InvoiceStatus } from '../../types/common.types'

function tone(status: InvoiceStatus) {
  if (status === 'paid') return 'green' as const
  if (status === 'open') return 'blue' as const
  return 'red' as const
}

export function BillingPage() {
  const invoices = useAppSelector((state) => state.platform.invoices)
  const companies = useAppSelector((state) => state.platform.companies)

  return (
    <div>
      <PageHeader title="Billing" subtitle="Payment history from the Lattice app" />
      <div className="rounded-2xl bg-white border border-[#DDE1E7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2F2F7] text-[#68707C] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Invoice</th>
              <th className="text-left font-semibold px-4 py-3">Company</th>
              <th className="text-left font-semibold px-4 py-3">Amount</th>
              <th className="text-left font-semibold px-4 py-3">Date</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-[#EAEDF1]">
                <td className="px-4 py-3 font-semibold">{invoice.id}</td>
                <td className="px-4 py-3 text-[#68707C]">
                  {companies.find((company) => company.id === invoice.companyId)?.name ?? '—'}
                </td>
                <td className="px-4 py-3">{money(invoice.amount)}</td>
                <td className="px-4 py-3 text-[#68707C]">{invoice.date}</td>
                <td className="px-4 py-3">
                  <Badge tone={tone(invoice.status)}>{invoice.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
