import { AlertTriangle, Building2, Users, Wallet } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { TrendChart } from '../../components/dashboard/TrendChart'
import { YearFilter } from '../../components/dashboard/YearFilter'
import { AttentionList } from '../../components/dashboard/AttentionList'
import { RecentPayments } from '../../components/dashboard/RecentPayments'
import { yearSeries } from '../../lib/seed'
import { compactMoney, money } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'

export function DashboardPage() {
  const year = useAppSelector((state) => state.platform.year)
  const companies = useAppSelector((state) => state.platform.companies)
  const series = yearSeries(year)
  const yearIncome = series.reduce((sum, point) => sum + point.income, 0)
  const liveSubs = companies.filter((company) => company.status === 'active').length
  const people = companies.reduce((sum, company) => sum + company.people, 0)
  const atRisk = companies.filter((company) => company.status === 'past_due' || company.status === 'trial').length
  const mrr = companies.reduce((sum, company) => sum + company.mrr, 0)

  return (
    <div className="flex flex-col gap-5 max-w-[1280px]">
      <PageHeader
        title="Overview"
        subtitle={`${year} platform health · ${money(mrr)} MRR`}
        action={<YearFilter />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="App income"
          value={compactMoney(yearIncome)}
          hint={`${year} collected potential`}
          icon={<Wallet className="w-[18px] h-[18px]" strokeWidth={1.9} />}
        />
        <StatCard
          label="Live companies"
          value={String(liveSubs)}
          hint={`${companies.length} total tenants`}
          icon={<Building2 className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="ink"
        />
        <StatCard
          label="People"
          value={String(people)}
          hint="Employees across companies"
          icon={<Users className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="ink"
        />
        <StatCard
          label="Needs action"
          value={String(atRisk)}
          hint="Trial or past due"
          icon={<AlertTriangle className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="amber"
        />
      </div>

      <TrendChart data={series} year={year} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <AttentionList />
        <RecentPayments />
      </div>
    </div>
  )
}
