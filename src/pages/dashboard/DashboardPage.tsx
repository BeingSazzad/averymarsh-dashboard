import { Wallet } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { TrendChart } from '../../components/dashboard/TrendChart'
import { YearFilter } from '../../components/dashboard/YearFilter'
import { AttentionList } from '../../components/dashboard/AttentionList'
import { RecentPayments } from '../../components/dashboard/RecentPayments'
import { yearSeries } from '../../lib/seed'
import { compactMoney } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'
import { Building2, CreditCard, Users } from 'lucide-react'

export function DashboardPage() {
  const year = useAppSelector((state) => state.platform.year)
  const companies = useAppSelector((state) => state.platform.companies)
  const series = yearSeries(year)
  const yearIncome = series.reduce((sum, point) => sum + point.income, 0)
  const totalCompanies = companies.length
  const totalSubscribers = companies.filter(
    (company) => company.status === 'active' || company.status === 'past_due'
  ).length
  const totalUsers = companies.reduce((sum, company) => sum + company.people, 0)

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Overview"
        subtitle={`${year} · companies buying Lattice, seats, and income`}
        action={<YearFilter />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Total companies"
          value={String(totalCompanies)}
          hint="Companies that bought Lattice"
          icon={<Building2 className="w-[18px] h-[18px]" strokeWidth={1.9} />}
        />
        <StatCard
          label="Total subscribers"
          value={String(totalSubscribers)}
          hint="Active or past-due paid plans"
          icon={<CreditCard className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="ink"
        />
        <StatCard
          label="Total users"
          value={String(totalUsers)}
          hint="People using the Lattice app"
          icon={<Users className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="ink"
        />
        <StatCard
          label="App income"
          value={compactMoney(yearIncome)}
          hint={`${year} subscription revenue`}
          icon={<Wallet className="w-[18px] h-[18px]" strokeWidth={1.9} />}
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
