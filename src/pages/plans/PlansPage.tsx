import { useState } from 'react'
import { Check, Wallet } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { money } from '../../lib/utils'
import { deletePlan, newPlan, upsertPlan } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Plan } from '../../types/common.types'
import { Badge } from '../../components/shared/Badge'

export function PlansPage() {
  const plans = useAppSelector((state) => state.platform.plans)
  const companies = useAppSelector((state) => state.platform.companies)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<Plan | null>(null)
  const [featuresText, setFeaturesText] = useState('')

  const openDraft = (plan: Plan) => {
    setDraft(plan)
    setFeaturesText(plan.features.join('\n'))
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Plans"
        subtitle="What companies buy · benefits mapped to Lattice app modules"
        action={
          <Button
            onClick={() => {
              const plan = newPlan()
              openDraft(plan)
            }}
          >
            Add plan
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const tenants = companies.filter((company) => company.planId === plan.id).length
          return (
            <div key={plan.id} className="panel panel-hover p-5 flex flex-col fade-up h-full">
              <div className="flex items-start justify-between gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </span>
                <Badge tone={plan.active ? 'green' : 'slate'}>{plan.active ? 'Live' : 'Off'}</Badge>
              </div>

              <h2 className="text-base font-bold text-[#171A1F] mt-4">{plan.name}</h2>
              <p className="text-sm text-[#68707C] mt-1 leading-snug min-h-[40px]">{plan.description}</p>

              <p className="text-2xl font-bold text-[#171A1F] mt-4 tabular-nums">
                {money(plan.monthlyPrice)}
                <span className="text-sm font-medium text-[#68707C]"> /mo</span>
              </p>
              <p className="text-xs text-[#68707C] mt-1">
                {money(plan.yearlyPrice)} /yr · {plan.seats} seats · {tenants}{' '}
                {tenants === 1 ? 'company' : 'companies'}
              </p>

              <ul className="mt-5 flex flex-col gap-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[#171A1F]">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 mt-5 pt-4 border-t border-[#EAEDF1]">
                <Button size="sm" variant="secondary" onClick={() => openDraft(plan)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => dispatch(deletePlan(plan.id))}>
                  Delete
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        title={draft && plans.some((plan) => plan.id === draft.id) ? 'Edit plan' : 'Add plan'}
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        wide
      >
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.name.trim()) return
              dispatch(
                upsertPlan({
                  ...draft,
                  features: featuresText
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean),
                })
              )
              setDraft(null)
            }}
          >
            <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Input
              label="Short description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Who this plan is for"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Monthly $"
                type="number"
                value={draft.monthlyPrice}
                onChange={(e) => setDraft({ ...draft, monthlyPrice: Number(e.target.value) })}
              />
              <Input
                label="Yearly $"
                type="number"
                value={draft.yearlyPrice}
                onChange={(e) => setDraft({ ...draft, yearlyPrice: Number(e.target.value) })}
              />
              <Input
                label="Seats"
                type="number"
                value={draft.seats}
                onChange={(e) => setDraft({ ...draft, seats: Number(e.target.value) })}
              />
            </div>
            <TextArea
              label="Benefits (one per line)"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={'Daily field logs\nBudget ledger\nPay apps & draws'}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              Live
            </label>
            <Button type="submit">Save plan</Button>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}
