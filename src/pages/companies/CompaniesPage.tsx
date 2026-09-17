import { useMemo, useState } from 'react'
import { Eye, KeyRound, Pencil, Plus, RefreshCw, Trash2, Users } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { CompanyMark } from '../../components/shared/CompanyMark'
import { SeatMeter } from '../../components/shared/SeatMeter'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Table, Td, Th } from '../../components/ui/Table'
import { companyLabel, companyTone } from '../../lib/status'
import { classNames, formatDate, money } from '../../lib/utils'
import {
  deleteCompany,
  grantAccess,
  renameCompany,
  renewCompany,
} from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { AccessMethod, Company } from '../../types/common.types'

type ModalMode =
  | { type: 'track' | 'rename' | 'delete'; company: Company }
  | { type: 'grant' }

export function CompaniesPage() {
  const companies = useAppSelector((state) => state.platform.companies)
  const plans = useAppSelector((state) => state.platform.plans)
  const users = useAppSelector((state) => state.platform.users)
  const dispatch = useAppDispatch()
  const [modal, setModal] = useState<ModalMode | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [query, setQuery] = useState('')
  const [grant, setGrant] = useState({
    companyName: '',
    planId: plans[1]?.id ?? plans[0]?.id ?? '',
    ownerName: '',
    ownerEmail: '',
    accessMethod: 'invite' as AccessMethod,
    tempPassword: 'LatticeTemp1!',
  })
  const [grantDone, setGrantDone] = useState<string | null>(null)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return companies
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(needle) ||
        (plans.find((plan) => plan.id === company.planId)?.name ?? '').toLowerCase().includes(needle)
    )
  }, [companies, plans, query])

  const trackedUsers = useMemo(() => {
    if (!modal || modal.type !== 'track') return []
    return users.filter((user) => user.companyId === modal.company.id)
  }, [modal, users])

  const totalPeople = companies.reduce((sum, company) => sum + company.people, 0)

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} tenants · ${totalPeople} people on Lattice`}
        action={
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="w-full sm:w-56">
              <Input placeholder="Search companies" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button
              onClick={() => {
                setGrantDone(null)
                setGrant({
                  companyName: '',
                  planId: plans[1]?.id ?? plans[0]?.id ?? '',
                  ownerName: '',
                  ownerEmail: '',
                  accessMethod: 'invite',
                  tempPassword: 'LatticeTemp1!',
                })
                setModal({ type: 'grant' })
              }}
            >
              <Plus className="w-4 h-4" />
              Grant access
            </Button>
          </div>
        }
      />

      <div className="panel p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <span className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
          <KeyRound className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#171A1F]">After you sell Lattice</p>
          <p className="text-sm text-[#68707C] mt-0.5 leading-relaxed">
            Use <span className="font-semibold text-[#171A1F]">Grant access</span> to create the company,
            pick a plan, then either email an invite or hand them a temporary login for the Lattice app.
          </p>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Company</Th>
            <Th>Plan</Th>
            <Th>People</Th>
            <Th>Access</Th>
            <Th>MRR</Th>
            <Th>Renews</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((company) => {
            const directoryCount = users.filter((user) => user.companyId === company.id).length
            return (
              <tr key={company.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                <Td>
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <CompanyMark name={company.name} logo={company.logo} />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#171A1F] truncate">{company.name}</p>
                      <p className="text-xs text-[#68707C] mt-0.5 truncate">{company.ownerEmail}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-[#68707C] font-medium">
                  {plans.find((plan) => plan.id === company.planId)?.name ?? '—'}
                </Td>
                <Td>
                  <div className="flex flex-col gap-1">
                    <SeatMeter people={company.people} seats={company.seats} />
                    <p className="text-[11px] text-[#68707C] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {directoryCount} in directory
                    </p>
                  </div>
                </Td>
                <Td>
                  <Badge tone={company.accessMethod === 'invite' ? 'blue' : 'slate'}>
                    {company.accessMethod === 'invite' ? 'Invite' : 'Login'}
                  </Badge>
                </Td>
                <Td className="font-bold tabular-nums text-[#171A1F]">{money(company.mrr)}</Td>
                <Td className="text-[#68707C] whitespace-nowrap">{formatDate(company.renewsOn)}</Td>
                <Td>
                  <Badge tone={companyTone(company.status)}>{companyLabel(company.status)}</Badge>
                </Td>
                <Td>
                  <div className="flex justify-end gap-1.5">
                    <IconButton
                      label="Track people"
                      tone="blue"
                      onClick={() => setModal({ type: 'track', company })}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton
                      label="Rename"
                      onClick={() => {
                        setRenameValue(company.name)
                        setModal({ type: 'rename', company })
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton label="Renew" onClick={() => dispatch(renewCompany(company.id))}>
                      <RefreshCw className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton
                      label="Delete"
                      tone="danger"
                      onClick={() => setModal({ type: 'delete', company })}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </IconButton>
                  </div>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Modal
        title={
          modal?.type === 'grant'
            ? 'Grant Lattice access'
            : modal?.type === 'track'
              ? `People · ${modal.company.name}`
              : modal?.type === 'rename'
                ? 'Rename company'
                : modal?.type === 'delete'
                  ? 'Delete company'
                  : ''
        }
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        wide={modal?.type === 'track' || modal?.type === 'grant'}
      >
        {modal?.type === 'grant' ? (
          grantDone ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#68707C] leading-relaxed">{grantDone}</p>
              <Button onClick={() => setModal(null)}>Done</Button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                if (!grant.companyName.trim() || !grant.ownerEmail.trim() || !grant.planId) return
                if (grant.accessMethod === 'credentials' && (grant.tempPassword?.length ?? 0) < 6) return
                dispatch(grantAccess(grant))
                setGrantDone(
                  grant.accessMethod === 'invite'
                    ? `Invite queued for ${grant.ownerEmail}. They open Lattice, accept, and set their password.`
                    : `Login ready for ${grant.ownerEmail}. Temporary password: ${grant.tempPassword}. Share it once, then ask them to change it.`
                )
              }}
            >
              <p className="text-sm text-[#68707C] leading-relaxed">
                You sold Lattice. Create the company workspace and give the owner a way into the app.
              </p>
              <Input
                label="Company name"
                value={grant.companyName}
                onChange={(e) => setGrant({ ...grant, companyName: e.target.value })}
                placeholder="e.g. Coastal Build Co"
              />
              <Select
                label="Subscription plan"
                value={grant.planId}
                onChange={(e) => setGrant({ ...grant, planId: e.target.value })}
                options={plans.map((plan) => ({
                  value: plan.id,
                  label: `${plan.name} · $${plan.monthlyPrice}/mo · ${plan.seats} seats`,
                }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Owner name"
                  value={grant.ownerName}
                  onChange={(e) => setGrant({ ...grant, ownerName: e.target.value })}
                  placeholder="Jordan Lee"
                />
                <Input
                  label="Owner email"
                  type="email"
                  value={grant.ownerEmail}
                  onChange={(e) => setGrant({ ...grant, ownerEmail: e.target.value })}
                  placeholder="owner@company.com"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#171A1F] mb-1.5">How they get in</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      {
                        id: 'invite' as const,
                        title: 'Send invite',
                        body: 'Email a secure link. Best default.',
                      },
                      {
                        id: 'credentials' as const,
                        title: 'Create login',
                        body: 'You set a temporary password now.',
                      },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setGrant({ ...grant, accessMethod: option.id })}
                      className={classNames(
                        'text-left rounded-2xl border p-3 cursor-pointer transition',
                        grant.accessMethod === option.id
                          ? 'border-[#1677FF] bg-[#EAF3FF]'
                          : 'border-[#DDE1E7] bg-white hover:bg-[#F8FAFC]'
                      )}
                    >
                      <p className="text-sm font-bold text-[#171A1F]">{option.title}</p>
                      <p className="text-xs text-[#68707C] mt-1">{option.body}</p>
                    </button>
                  ))}
                </div>
              </div>

              {grant.accessMethod === 'credentials' ? (
                <Input
                  label="Temporary password"
                  value={grant.tempPassword}
                  onChange={(e) => setGrant({ ...grant, tempPassword: e.target.value })}
                />
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="secondary" onClick={() => setModal(null)}>
                  Cancel
                </Button>
                <Button type="submit">Create & grant access</Button>
              </div>
            </form>
          )
        ) : null}

        {modal?.type === 'track' ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[#68707C]">
              {modal.company.people} people on this account · {trackedUsers.length} shown in directory
            </p>
            {trackedUsers.length === 0 ? (
              <p className="text-sm text-[#68707C] py-4 text-center">No directory users yet.</p>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-[#EAEDF1] rounded-xl border border-[#EAEDF1]">
                {trackedUsers.map((user) => (
                  <li key={user.id} className="px-3 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#171A1F] truncate">{user.name}</p>
                      <p className="text-xs text-[#68707C] truncate">{user.email}</p>
                    </div>
                    <Badge tone="slate">{user.role}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="secondary" onClick={() => setModal(null)}>
              Close
            </Button>
          </div>
        ) : null}

        {modal?.type === 'rename' ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!renameValue.trim()) return
              dispatch(renameCompany({ id: modal.company.id, name: renameValue }))
              setModal(null)
            }}
          >
            <Input label="Company name" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button type="submit">Save name</Button>
            </div>
          </form>
        ) : null}

        {modal?.type === 'delete' ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#68707C] leading-relaxed">
              Remove <span className="font-semibold text-[#171A1F]">{modal.company.name}</span> and its{' '}
              {modal.company.people} people from Lattice?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModal(null)}>
                Keep
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  dispatch(deleteCompany(modal.company.id))
                  setModal(null)
                }}
              >
                Delete company
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
