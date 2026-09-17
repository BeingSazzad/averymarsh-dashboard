import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { useAppSelector } from '../../store/hooks'
import { money } from '../../lib/utils'
import type { CompanyStatus } from '../../types/common.types'

function tone(status: CompanyStatus) {
  if (status === 'active') return 'green' as const
  if (status === 'trial') return 'blue' as const
  if (status === 'past_due') return 'amber' as const
  return 'red' as const
}

export function CompaniesPage() {
  const companies = useAppSelector((state) => state.platform.companies)
  const plans = useAppSelector((state) => state.platform.plans)

  return (
    <div>
      <PageHeader title="Companies" subtitle="Tenants currently on Lattice" />
      <div className="rounded-2xl bg-white border border-[#DDE1E7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2F2F7] text-[#68707C] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Company</th>
              <th className="text-left font-semibold px-4 py-3">Plan</th>
              <th className="text-left font-semibold px-4 py-3">Seats</th>
              <th className="text-left font-semibold px-4 py-3">MRR</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-t border-[#EAEDF1]">
                <td className="px-4 py-3 font-semibold text-[#171A1F]">{company.name}</td>
                <td className="px-4 py-3 text-[#68707C]">
                  {plans.find((plan) => plan.id === company.planId)?.name ?? '—'}
                </td>
                <td className="px-4 py-3">{company.seats}</td>
                <td className="px-4 py-3">{money(company.mrr)}</td>
                <td className="px-4 py-3">
                  <Badge tone={tone(company.status)}>{company.status.replace('_', ' ')}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
