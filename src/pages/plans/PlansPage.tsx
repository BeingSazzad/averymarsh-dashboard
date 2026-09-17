import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { money } from '../../lib/utils'
import { deletePlan, newPlan, upsertPlan } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Plan } from '../../types/common.types'
import { Badge } from '../../components/shared/Badge'

export function PlansPage() {
  const plans = useAppSelector((state) => state.platform.plans)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<Plan | null>(null)

  return (
    <div>
      <PageHeader
        title="Subscription plans"
        subtitle="Add, edit, or archive what companies buy"
        action={<Button onClick={() => setDraft(newPlan())}>Add plan</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl bg-white border border-[#DDE1E7] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#171A1F]">{plan.name}</h2>
                <p className="text-sm text-[#68707C] mt-0.5">{plan.seats} seats</p>
              </div>
              <Badge tone={plan.active ? 'green' : 'slate'}>{plan.active ? 'Live' : 'Off'}</Badge>
            </div>
            <p className="text-2xl font-bold text-[#171A1F]">{money(plan.monthlyPrice)}<span className="text-sm font-medium text-[#68707C]"> /mo</span></p>
            <p className="text-xs text-[#68707C]">{money(plan.yearlyPrice)} /yr</p>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setDraft(plan)}>Edit</Button>
              <Button variant="danger" onClick={() => dispatch(deletePlan(plan.id))}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal title={draft && plans.some((plan) => plan.id === draft.id) ? 'Edit plan' : 'Add plan'} open={Boolean(draft)} onClose={() => setDraft(null)}>
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.name.trim()) return
              dispatch(upsertPlan(draft))
              setDraft(null)
            }}
          >
            <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Input label="Monthly $" type="number" value={draft.monthlyPrice} onChange={(e) => setDraft({ ...draft, monthlyPrice: Number(e.target.value) })} />
            <Input label="Yearly $" type="number" value={draft.yearlyPrice} onChange={(e) => setDraft({ ...draft, yearlyPrice: Number(e.target.value) })} />
            <Input label="Seats" type="number" value={draft.seats} onChange={(e) => setDraft({ ...draft, seats: Number(e.target.value) })} />
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
