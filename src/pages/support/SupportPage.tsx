import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LifeBuoy, Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Table, Td, Th } from '../../components/ui/Table'
import { ticketTone } from '../../lib/status'
import { formatDate } from '../../lib/utils'
import { newTicket, setTicketStatus, upsertTicket } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { SupportTicket, TicketPriority } from '../../types/common.types'

export function SupportPage() {
  const tickets = useAppSelector((state) => state.platform.tickets)
  const companies = useAppSelector((state) => state.platform.companies)
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all')
  const [draft, setDraft] = useState<SupportTicket | null>(null)

  const rows = useMemo(() => {
    if (filter === 'all') return tickets
    return tickets.filter((ticket) => ticket.status === filter)
  }, [tickets, filter])

  const openCount = tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'pending').length

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Support"
        subtitle={`${openCount} open · password resets, billing, and access help`}
        action={
          <Button
            onClick={() =>
              setDraft(newTicket(companies[0]?.id ?? ''))
            }
          >
            <Plus className="w-4 h-4" />
            New ticket
          </Button>
        }
      />

      <div className="panel p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
          <LifeBuoy className="w-4 h-4" />
        </span>
        <p className="text-sm text-[#68707C] leading-relaxed">
          Standard support queue for Lattice customers. Open a company to reset passwords, check members, and payment
          history in one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 bg-[#EAEDF1] p-1 rounded-2xl w-fit">
        {(['all', 'open', 'pending', 'resolved'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`h-9 px-3.5 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
              filter === item ? 'bg-white text-[#1677FF] shadow-sm' : 'text-[#68707C]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Ticket</Th>
            <Th>Company</Th>
            <Th>Priority</Th>
            <Th>Status</Th>
            <Th>Updated</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((ticket) => {
            const company = companies.find((item) => item.id === ticket.companyId)
            return (
              <tr key={ticket.id} className="hover:bg-[#F8FAFC]/80">
                <Td>
                  <p className="font-semibold text-[#171A1F]">{ticket.subject}</p>
                  <p className="text-xs text-[#68707C] mt-0.5">{ticket.requester}</p>
                </Td>
                <Td>
                  {company ? (
                    <Link to={`/companies/${company.id}`} className="text-sm font-semibold text-[#1677FF] hover:underline">
                      {company.name}
                    </Link>
                  ) : (
                    '—'
                  )}
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
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dispatch(setTicketStatus({ id: ticket.id, status: 'open' }))}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Modal title="New support ticket" open={Boolean(draft)} onClose={() => setDraft(null)} wide>
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.subject.trim() || !draft.companyId) return
              dispatch(upsertTicket(draft))
              setDraft(null)
            }}
          >
            <Select
              label="Company"
              value={draft.companyId}
              onChange={(e) => setDraft({ ...draft, companyId: e.target.value })}
              options={companies.map((company) => ({ value: company.id, label: company.name }))}
            />
            <Input
              label="Subject"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Password reset, billing, seats…"
            />
            <Input
              label="Requester email"
              type="email"
              value={draft.requester}
              onChange={(e) => setDraft({ ...draft, requester: e.target.value })}
            />
            <Select
              label="Priority"
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value as TicketPriority })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
              ]}
            />
            <TextArea
              label="Details"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button type="submit">Create ticket</Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}
