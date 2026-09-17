import { useState } from 'react'
import { Check } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/ui/Button'
import { FeatureListEditor } from '../../components/ui/FeatureListEditor'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { money } from '../../lib/utils'
import { deletePlan, upsertPlan } from '../../store/platformSlice'
import { newPlan } from '../../lib/factories'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Plan } from '../../types/common.types'

function cleanFeatures(features: string[]) {
  return features.map((item) => item.trim()).filter(Boolean).slice(0, 5)
}

export function PlansPage() {
  const plans = useAppSelector((state) => state.platform.plans)
  const companies = useAppSelector((state) => state.platform.companies)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<Plan | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Plan | null>(null)
  const [error, setError] = useState('')

  const openDraft = (plan: Plan) => {
    setError('')
    setDraft({
      ...plan,
      features: plan.features.length ? [...plan.features] : [''],
    })
  }

  const saveDraft = () => {
    if (!draft) return
    if (!draft.name.trim()) {
      setError('Enter a plan name.')
      return
    }
    dispatch(
      upsertPlan({
        ...draft,
        name: draft.name.trim(),
        description: draft.description.trim(),
        monthlyPrice: Number(draft.monthlyPrice) || 0,
        yearlyPrice: Number(draft.yearlyPrice) || 0,
        seats: Math.max(1, Number(draft.seats) || 1),
        features: cleanFeatures(draft.features),
      })
    )
    setDraft(null)
    setError('')
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Plans"
        action={
          <Button
            onClick={() => {
              openDraft(newPlan())
            }}
          >
            Add plan
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {plans.map((plan) => (
          <article key={plan.id} className="panel flex flex-col fade-up overflow-hidden">
            <div className="px-5 pt-5 pb-4 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#171A1F] tracking-tight leading-none">{plan.name}</h2>
                <Badge tone={plan.active ? 'green' : 'slate'}>{plan.active ? 'Live' : 'Off'}</Badge>
              </div>
              {plan.description ? (
                <p className="text-sm text-[#68707C] mt-2 leading-snug">{plan.description}</p>
              ) : null}

              <div className="mt-4 flex items-end gap-1.5">
                <p className="text-[32px] font-bold text-[#171A1F] tracking-tight tabular-nums leading-none">
                  {money(plan.monthlyPrice)}
                </p>
                <span className="text-sm font-medium text-[#68707C] pb-1">/mo</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <MetaChip label={`${money(plan.yearlyPrice)} /yr`} />
                <MetaChip label={`${plan.seats} seats`} />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#EAEDF1] flex-1 flex flex-col">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8] mb-3">
                Includes
              </p>
              <ul className="flex flex-col gap-2">
                {plan.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[#171A1F]">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
                {plan.features.length === 0 ? (
                  <li className="text-sm text-[#94A3B8]">No benefits yet</li>
                ) : null}
              </ul>
            </div>

            <div className="px-5 py-3.5 border-t border-[#EAEDF1] bg-[#F8FAFC]/80 flex gap-2 mt-auto">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => openDraft(plan)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => setPendingDelete(plan)}>
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        title={draft && plans.some((plan) => plan.id === draft.id) ? 'Edit plan' : 'Add plan'}
        open={Boolean(draft)}
        onClose={() => {
          setDraft(null)
          setError('')
        }}
        wide
      >
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              saveDraft()
            }}
          >
            <Input
              label="Name"
              value={draft.name}
              onChange={(e) => {
                setError('')
                setDraft({ ...draft, name: e.target.value })
              }}
              placeholder="Plan name"
              autoFocus
            />
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
                min={0}
                value={draft.monthlyPrice}
                onChange={(e) => setDraft({ ...draft, monthlyPrice: Number(e.target.value) })}
              />
              <Input
                label="Yearly $"
                type="number"
                min={0}
                value={draft.yearlyPrice}
                onChange={(e) => setDraft({ ...draft, yearlyPrice: Number(e.target.value) })}
              />
              <Input
                label="Seats"
                type="number"
                min={1}
                value={draft.seats}
                onChange={(e) => setDraft({ ...draft, seats: Number(e.target.value) })}
              />
            </div>
            <FeatureListEditor
              value={draft.features}
              onChange={(features) => setDraft({ ...draft, features })}
              max={5}
            />
            <label className="flex items-center gap-2 text-sm font-medium text-[#171A1F]">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              Live
            </label>
            {error ? <p className="text-xs font-semibold text-[#E5484D]">{error}</p> : null}
            <Button type="submit" className="w-full">
              Save plan
            </Button>
          </form>
        ) : null}
      </Modal>

      <Modal
        title="Delete plan"
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        {pendingDelete ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#68707C] leading-relaxed">
              Delete <span className="font-semibold text-[#171A1F]">{pendingDelete.name}</span>?
              {(() => {
                const onPlan = companies.filter((company) => company.planId === pendingDelete.id).length
                if (onPlan === 0) return null
                return (
                  <>
                    {' '}
                    {onPlan} {onPlan === 1 ? 'company is' : 'companies are'} on this plan.
                  </>
                )
              })()}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPendingDelete(null)}>
                Keep
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  dispatch(deletePlan(pendingDelete.id))
                  setPendingDelete(null)
                }}
              >
                Delete plan
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

function MetaChip({ label }: { label: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-lg bg-[#F2F2F7] px-2.5 text-[11px] font-semibold text-[#68707C]">
      {label}
    </span>
  )
}
