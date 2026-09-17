import { useMemo } from 'react'
import { Building2, CircleDollarSign, Users, Wallet } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { TrendChart } from '../../components/dashboard/TrendChart'
import { TopPlanCard } from '../../components/dashboard/TopPlanCard'
import { AttentionList } from '../../components/dashboard/AttentionList'
import { RecentPayments } from '../../components/dashboard/RecentPayments'
import { yearSeries } from '../../lib/seed'
import { compactMoney, money } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'

export function DashboardPage() {
  const year = useAppSelector((state) => state.platform.year)
  const companies = useAppSelector((state) => state.platform.companies)
  const plans = useAppSelector((state) => state.platform.plans)
  const series = yearSeries(year)
  const totalCompanies = companies.length
  const totalUsers = companies.reduce((sum, company) => sum + company.people, 0)
  const mrr = companies
    .filter((company) => company.status === 'active' || company.status === 'past_due')
    .reduce((sum, company) => sum + company.mrr, 0)

  const topPlan = useMemo(() => {
    const counts = new Map<string, number>()
    for (const company of companies) {
      counts.set(company.planId, (counts.get(company.planId) ?? 0) + 1)
    }
    let bestId = ''
    let bestCount = 0
    for (const [planId, count] of counts) {
      if (count > bestCount) {
        bestId = planId
        bestCount = count
      }
    }
    const plan = plans.find((item) => item.id === bestId)
    return {
      name: plan?.name ?? '—',
      count: bestCount,
      total: companies.length,
      price: plan?.monthlyPrice,
    }
  }, [companies, plans])

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader title="Overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Total companies"
          value={String(totalCompanies)}
          icon={<Building2 className="w-[18px] h-[18px]" strokeWidth={1.9} />}
        />
        <StatCard
          label="Total users"
          value={String(totalUsers)}
          icon={<Users className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="ink"
        />
        <StatCard
          label="MRR"
          value={money(mrr)}
          icon={<CircleDollarSign className="w-[18px] h-[18px]" strokeWidth={1.9} />}
          accent="ink"
        />
        <StatCard
          label="Revenue"
          value={compactMoney(mrr * 12)}
          icon={<Wallet className="w-[18px] h-[18px]" strokeWidth={1.9} />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-3 items-stretch">
        <TrendChart data={series} year={year} />
        <TopPlanCard
          name={topPlan.name}
          count={topPlan.count}
          total={topPlan.total}
          price={topPlan.price}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <AttentionList />
        <RecentPayments />
      </div>
    </div>
  )
}
