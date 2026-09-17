import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { TrendChart } from '../../components/dashboard/TrendChart'
import { YearFilter } from '../../components/dashboard/YearFilter'
import { yearSeries } from '../../lib/seed'
import { compactMoney } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'

export function DashboardPage() {
  const year = useAppSelector((state) => state.platform.year)
  const companies = useAppSelector((state) => state.platform.companies)
  const users = useAppSelector((state) => state.platform.users)
  const invoices = useAppSelector((state) => state.platform.invoices)
  const series = yearSeries(year)
  const last = series[series.length - 1]
  const yearIncome = series.reduce((sum, point) => sum + point.income, 0)
  const activeSubs = companies.filter((company) => company.status === 'active' || company.status === 'past_due').length
  const paid = invoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`${year} · 12-month users, subscriptions, and app income`}
        action={<YearFilter />}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard label="Users" value={String(last.users)} hint={`${users.length} in tenant list`} />
        <StatCard label="Subscriptions" value={String(last.subscriptions)} hint={`${activeSubs} companies on a plan`} />
        <StatCard label="App income" value={compactMoney(yearIncome)} hint={`${year} total`} />
        <StatCard label="Collected" value={compactMoney(paid)} hint="Paid invoices" />
      </div>
      <div className="rounded-2xl bg-white border border-[#DDE1E7] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#171A1F]">{year} monthly trend</h2>
          <p className="text-[11px] text-[#68707C]">Blue income · Sky users · Green subscriptions</p>
        </div>
        <TrendChart data={series} />
      </div>
    </div>
  )
}
