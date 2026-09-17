import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { Table, Td, Th } from '../../components/ui/Table'
import { invoiceTone } from '../../lib/status'
import { formatDate, money } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'

export function BillingPage() {
  const invoices = useAppSelector((state) => state.platform.invoices)
  const companies = useAppSelector((state) => state.platform.companies)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Billing" subtitle="Invoices from Lattice subscriptions" />
      <Table>
        <thead>
          <tr>
            <Th>Invoice</Th>
            <Th>Company</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-[#F8FAFC]">
              <Td className="font-semibold">{invoice.id}</Td>
              <Td className="text-[#68707C]">
                {companies.find((company) => company.id === invoice.companyId)?.name ?? '—'}
              </Td>
              <Td className="font-semibold tabular-nums">{money(invoice.amount)}</Td>
              <Td className="text-[#68707C]">{formatDate(invoice.date)}</Td>
              <Td>
                <Badge tone={invoiceTone(invoice.status)}>{invoice.status}</Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
