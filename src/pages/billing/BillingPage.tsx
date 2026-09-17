import { Download } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/ui/Button'
import { Table, Td, Th } from '../../components/ui/Table'
import { invoiceTone } from '../../lib/status'
import { formatDate, money } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function BillingPage() {
  const invoices = useAppSelector((state) => state.platform.invoices)
  const companies = useAppSelector((state) => state.platform.companies)

  const exportCsv = () => {
    const rows = [
      ['Invoice', 'Company', 'Amount', 'Date', 'Status'],
      ...invoices.map((invoice) => {
        const company = companies.find((item) => item.id === invoice.companyId)?.name ?? ''
        return [
          invoice.id,
          company,
          String(invoice.amount),
          invoice.date,
          invoice.status,
        ]
      }),
    ]
    const csv = rows.map((row) => row.map((cell) => csvEscape(cell)).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lattice-billing-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Billing"
        action={
          <Button variant="secondary" onClick={exportCsv} disabled={invoices.length === 0}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        }
      />
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
