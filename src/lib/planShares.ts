const PLAN_COLORS = ['#1677FF', '#12B5C9', '#F5A524', '#0F766E'] as const

export interface PlanShare {
  id: string
  name: string
  count: number
  percent: number
  color: string
}

export function buildPlanShares(
  plans: Array<{ id: string; name: string }>,
  companies: Array<{ planId: string }>
): { shares: PlanShare[]; total: number } {
  const total = companies.length
  const counts = new Map<string, number>()
  for (const company of companies) {
    counts.set(company.planId, (counts.get(company.planId) ?? 0) + 1)
  }

  const shares = plans.slice(0, 4).map((plan, index) => {
    const count = counts.get(plan.id) ?? 0
    const percent = total > 0 ? Math.round((count / total) * 100) : 0
    return {
      id: plan.id,
      name: plan.name,
      count,
      percent,
      color: PLAN_COLORS[index % PLAN_COLORS.length],
    }
  })

  if (total > 0 && shares.length > 0) {
    const sum = shares.reduce((acc, s) => acc + s.percent, 0)
    const diff = 100 - sum
    if (diff !== 0) {
      const richest = [...shares].sort((a, b) => b.count - a.count)[0]
      const target = shares.find((s) => s.id === richest.id)
      if (target) target.percent = Math.max(0, target.percent + diff)
    }
  }

  return { shares, total }
}
