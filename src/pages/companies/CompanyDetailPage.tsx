import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, KeyRound, PauseCircle, PlayCircle } from 'lucide-react'
import { Avatar } from '../../components/shared/Avatar'
import { Badge } from '../../components/shared/Badge'
import { CompanyMark } from '../../components/shared/CompanyMark'
import { SeatMeter } from '../../components/shared/SeatMeter'
import { SuspendConfirm } from '../../components/shared/SuspendConfirm'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Table, Td, Th } from '../../components/ui/Table'
import { ROUTES } from '../../constants/routes'
import { companyLabel, companyTone, invoiceTone, ticketTone } from '../../lib/status'
import { classNames, formatDate, money } from '../../lib/utils'
import {
  resetUserPassword,
  setCompanyStatus,
  setTicketStatus,
} from '../../store/platformSlice'
import { makeTempPassword } from '../../lib/factories'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { CompanyStatus, SeatUser } from '../../types/common.types'

type Tab = 'overview' | 'members' | 'payments' | 'tickets'
type StatusAction = 'suspend' | 'restore' | null

export function CompanyDetailPage() {
  const { companyId = '' } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const company = useAppSelector((state) => state.platform.companies.find((item) => item.id === companyId))
  const plans = useAppSelector((state) => state.platform.plans)
  const users = useAppSelector((state) => state.platform.users.filter((user) => user.companyId === companyId))
  const invoices = useAppSelector((state) =>
    state.platform.invoices.filter((invoice) => invoice.companyId === companyId)
  )
  const tickets = useAppSelector((state) =>
    state.platform.tickets.filter((ticket) => ticket.companyId === companyId)
  )
  const [tab, setTab] = useState<Tab>('overview')
  const [resetUser, setResetUser] = useState<SeatUser | null>(null)
  const [tempPassword, setTempPassword] = useState('')
  const [statusAction, setStatusAction] = useState<StatusAction>(null)

  const plan = useMemo(
    () => plans.find((item) => item.id === company?.planId),
    [plans, company?.planId]
  )

  if (!company) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[#68707C]">Company not found.</p>
        <Button variant="secondary" onClick={() => navigate(ROUTES.companies)}>
          Back to companies
        </Button>
      </div>
    )
  }

  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members', count: users.length },
    { id: 'payments', label: 'Payments', count: invoices.length },
    { id: 'tickets', label: 'Tickets', count: tickets.length },
  ]

  const isBlocked = company.status === 'suspended'

  const applyStatus = (status: CompanyStatus) => {
    dispatch(setCompanyStatus({ id: company.id, status }))
    setStatusAction(null)
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <section className="panel overflow-hidden fade-up">
        <div className="relative px-5 pt-5 pb-5 md:px-6 md:pt-6 md:pb-6">
          <div
            className={classNames(
              'pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br to-transparent',
              company.status === 'suspended' ? 'from-[#FFF7E6] via-[#F8FAFC]' : 'from-[#EAF3FF] via-[#F8FAFC]'
            )}
            aria-hidden
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.companies)}
                  className="mt-1 w-9 h-9 rounded-xl border border-[#DDE1E7] bg-white text-[#68707C] hover:text-[#171A1F] hover:bg-[#F8FAFC] inline-flex items-center justify-center cursor-pointer shrink-0"
                  aria-label="Back to companies"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <CompanyMark name={company.name} logo={company.logo} size={64} className="!rounded-2xl shadow-sm" />

                <div className="min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-[22px] font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                      {company.name}
                    </h1>
                    <Badge tone={companyTone(company.status)}>{companyLabel(company.status)}</Badge>
                  </div>
                  <p className="text-sm text-[#68707C] mt-1.5 truncate">{company.ownerEmail}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-[#94A3B8]">
                    <span>Joined {formatDate(company.joined)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#DDE1E7]" />
                    <span>Renews {formatDate(company.renewsOn)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end shrink-0 pl-12 lg:pl-0">
                {isBlocked ? (
                  <Button size="sm" onClick={() => setStatusAction('restore')}>
                    <PlayCircle className="w-3.5 h-3.5" />
                    Restore access
                  </Button>
                ) : (
                  <Button size="sm" variant="danger" onClick={() => setStatusAction('suspend')}>
                    <PauseCircle className="w-3.5 h-3.5" />
                    Suspend
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const owner = users.find((user) => user.role === 'Owner') ?? users[0]
                    if (!owner) return
                    const next = makeTempPassword()
                    setTempPassword(next)
                    setResetUser(owner)
                  }}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Reset password
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <MetricCard label="Plan" value={plan?.name ?? '—'} hint={plan ? `${money(plan.monthlyPrice)}/mo` : undefined} />
              <MetricCard
                label="Status"
                value={companyLabel(company.status)}
                valueTone={
                  company.status === 'active'
                    ? 'green'
                    : company.status === 'past_due' || company.status === 'suspended'
                      ? 'amber'
                      : company.status === 'canceled'
                        ? 'red'
                        : 'slate'
                }
              />
              <MetricCard label="MRR" value={money(company.mrr)} />
              <div className="rounded-2xl border border-[#EAEDF1] bg-white/90 px-4 py-3.5 flex flex-col gap-2 min-h-[88px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">People</p>
                <SeatMeter people={company.people} seats={company.seats} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-1 bg-[#EAEDF1] p-1 rounded-2xl w-fit">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={classNames(
              'h-9 px-3.5 rounded-xl text-xs font-semibold cursor-pointer',
              tab === item.id ? 'bg-white text-[#1677FF] shadow-sm' : 'text-[#68707C]'
            )}
          >
            {item.label}
            {typeof item.count === 'number' ? ` · ${item.count}` : ''}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="panel p-5 flex flex-col gap-1">
            <h2 className="text-sm font-bold text-[#171A1F] mb-2">Account</h2>
            <Row label="Renews" value={formatDate(company.renewsOn)} />
            <Row label="Owner email" value={company.ownerEmail} />
            <Row label="Open tickets" value={String(tickets.filter((t) => t.status !== 'resolved').length)} />
          </div>
          <div className="panel p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#171A1F]">Recent payments</h2>
              <button
                type="button"
                className="text-xs font-semibold text-[#1677FF] cursor-pointer"
                onClick={() => setTab('payments')}
              >
                All
              </button>
            </div>
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#EAEDF1] bg-[#F8FAFC]/70 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-[#171A1F]">{invoice.id}</p>
                  <p className="text-xs text-[#68707C]">{formatDate(invoice.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums">{money(invoice.amount)}</span>
                  <Badge tone={invoiceTone(invoice.status)}>{invoice.status}</Badge>
                </div>
              </div>
            ))}
            {invoices.length === 0 ? <p className="text-sm text-[#68707C]">No invoices yet.</p> : null}
          </div>
        </div>
      ) : null}

      {tab === 'members' ? (
        <Table>
          <thead>
            <tr>
              <Th>Member</Th>
              <Th>Role</Th>
              <Th>Join date</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar src="" name={user.name} size={36} />
                    <div>
                      <p className="font-semibold text-[#171A1F]">{user.name}</p>
                      <p className="text-xs text-[#68707C]">{user.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <Badge tone="slate">{user.role}</Badge>
                </Td>
                <Td className="text-[#68707C]">{formatDate(user.joined)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}

      {tab === 'payments' ? (
        <Table>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <Td className="font-semibold">{invoice.id}</Td>
                <Td className="font-bold tabular-nums">{money(invoice.amount)}</Td>
                <Td className="text-[#68707C]">{formatDate(invoice.date)}</Td>
                <Td>
                  <Badge tone={invoiceTone(invoice.status)}>{invoice.status}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}

      {tab === 'tickets' ? (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <Link to={ROUTES.support} className="text-xs font-semibold text-[#1677FF] hover:underline">
              All support tickets
            </Link>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Ticket</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>Updated</Th>
                <Th className="text-right"> </Th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <Td>
                    <p className="font-semibold text-[#171A1F]">{ticket.subject}</p>
                    <p className="text-xs text-[#68707C] mt-1 leading-relaxed line-clamp-2 max-w-md">
                      {ticket.body.trim() || 'No description'}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-1.5">{ticket.requester}</p>
                  </Td>
                  <Td>
                    <Badge tone={ticket.priority === 'high' ? 'amber' : 'slate'}>{ticket.priority}</Badge>
                  </Td>
                  <Td>
                    <Badge tone={ticketTone(ticket.status)}>{ticket.status}</Badge>
                  </Td>
                  <Td className="text-[#68707C]">{formatDate(ticket.updatedAt)}</Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      {ticket.status !== 'resolved' ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => dispatch(setTicketStatus({ id: ticket.id, status: 'resolved' }))}
                        >
                          Resolve
                        </Button>
                      ) : null}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {tickets.length === 0 ? <p className="text-sm text-[#68707C]">No tickets for this company.</p> : null}
        </div>
      ) : null}

      <Modal
        title={statusAction === 'restore' ? 'Restore access' : 'Suspend company'}
        open={Boolean(statusAction)}
        onClose={() => setStatusAction(null)}
      >
        {statusAction === 'suspend' ? (
          <SuspendConfirm
            companyName={company.name}
            people={company.people}
            onCancel={() => setStatusAction(null)}
            onConfirm={() => applyStatus('suspended')}
          />
        ) : null}
        {statusAction === 'restore' ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#68707C] leading-relaxed">
              Restore access for <span className="font-semibold text-[#171A1F]">{company.name}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setStatusAction(null)}>
                Cancel
              </Button>
              <Button onClick={() => applyStatus('active')}>Restore access</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        title="Reset password"
        open={Boolean(resetUser)}
        onClose={() => {
          setResetUser(null)
          setTempPassword('')
        }}
      >
        {resetUser ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#68707C] leading-relaxed">
              Temporary password for {resetUser.name} ({resetUser.email})
            </p>
            <div className="rounded-xl bg-[#F2F2F7] px-3 py-2.5 font-mono text-sm font-bold text-[#171A1F]">
              {tempPassword}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setResetUser(null)
                  setTempPassword('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  dispatch(resetUserPassword({ userId: resetUser.id, tempPassword }))
                  setResetUser(null)
                  setTempPassword('')
                }}
              >
                Confirm reset
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

function MetricCard({
  label,
  value,
  hint,
  valueTone = 'slate',
}: {
  label: string
  value: string
  hint?: string
  valueTone?: 'green' | 'amber' | 'red' | 'slate'
}) {
  const toneClass =
    valueTone === 'green'
      ? 'text-[#10A976]'
      : valueTone === 'amber'
        ? 'text-[#D97706]'
        : valueTone === 'red'
          ? 'text-[#E5484D]'
          : 'text-[#171A1F]'

  return (
    <div className="rounded-2xl border border-[#EAEDF1] bg-white/90 px-4 py-3.5 flex flex-col gap-1.5 min-h-[88px]">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">{label}</p>
      <p className={classNames('text-base font-bold tracking-tight leading-none', toneClass)}>{value}</p>
      {hint ? <p className="text-[11px] text-[#94A3B8]">{hint}</p> : null}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#EAEDF1] first:border-t-0 pt-2.5 first:pt-0">
      <span className="text-xs font-semibold text-[#68707C]">{label}</span>
      <span className="text-sm font-semibold text-[#171A1F] text-right truncate">{value}</span>
    </div>
  )
}
