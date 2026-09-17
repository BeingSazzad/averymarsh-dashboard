import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, KeyRound, RefreshCw } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Badge } from '../../components/shared/Badge'
import { CompanyMark } from '../../components/shared/CompanyMark'
import { SeatMeter } from '../../components/shared/SeatMeter'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Table, Td, Th } from '../../components/ui/Table'
import { ROUTES } from '../../constants/routes'
import { companyLabel, companyTone, invoiceTone, ticketTone } from '../../lib/status'
import { classNames, formatDate, money } from '../../lib/utils'
import {
  makeTempPassword,
  renewCompany,
  resetUserPassword,
  setTicketStatus,
} from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { SeatUser } from '../../types/common.types'

type Tab = 'overview' | 'members' | 'payments' | 'tickets'

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

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-start gap-3">
        <Button variant="ghost" className="!px-2" onClick={() => navigate(ROUTES.companies)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <PageHeader
            title={company.name}
            subtitle={`${company.ownerEmail} · joined ${formatDate(company.joined)}`}
            action={
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => dispatch(renewCompany(company.id))}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Renew
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const owner = users.find((user) => user.role === 'Owner') ?? users[0]
                    if (!owner) return
                    const next = makeTempPassword()
                    setTempPassword(next)
                    setResetUser(owner)
                  }}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Reset owner password
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <div className="panel p-5 flex flex-col md:flex-row md:items-center gap-4">
        <CompanyMark name={company.name} logo={company.logo} size={56} />
        <div className="min-w-0 flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Plan</p>
            <p className="text-sm font-bold text-[#171A1F] mt-1">{plan?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Status</p>
            <div className="mt-1">
              <Badge tone={companyTone(company.status)}>{companyLabel(company.status)}</Badge>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">MRR</p>
            <p className="text-sm font-bold text-[#171A1F] mt-1 tabular-nums">{money(company.mrr)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">People</p>
            <div className="mt-1">
              <SeatMeter people={company.people} seats={company.seats} />
            </div>
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="panel p-5 flex flex-col gap-3">
            <h2 className="text-sm font-bold text-[#171A1F]">Account</h2>
            <Row label="Access" value={company.accessMethod === 'invite' ? 'Invite' : 'Login'} />
            <Row label="Renews" value={formatDate(company.renewsOn)} />
            <Row label="Owner email" value={company.ownerEmail} />
            <Row label="Open tickets" value={String(tickets.filter((t) => t.status !== 'resolved').length)} />
          </div>
          <div className="panel p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#171A1F]">Recent payments</h2>
              <button type="button" className="text-xs font-semibold text-[#1677FF] cursor-pointer" onClick={() => setTab('payments')}>
                All
              </button>
            </div>
            {invoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between gap-3">
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
              <Th>Last active</Th>
              <Th className="text-right">Support</Th>
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
                <Td className="text-[#68707C]">{formatDate(user.lastActive)}</Td>
                <Td>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const next = makeTempPassword()
                        setTempPassword(next)
                        setResetUser(user)
                      }}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Reset password
                    </Button>
                  </div>
                </Td>
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
                    <p className="text-xs text-[#68707C] mt-0.5">{ticket.requester}</p>
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
              Create a temporary password for{' '}
              <span className="font-semibold text-[#171A1F]">{resetUser.name}</span> ({resetUser.email}). Share it
              once, then ask them to change it in the Lattice app.
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#EAEDF1] first:border-t-0 pt-2.5 first:pt-0">
      <span className="text-xs font-semibold text-[#68707C]">{label}</span>
      <span className="text-sm font-semibold text-[#171A1F] text-right truncate">{value}</span>
    </div>
  )
}
