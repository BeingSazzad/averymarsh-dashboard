import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Input, TextArea } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Table, Td, Th } from '../../components/ui/Table'
import { ticketTone } from '../../lib/status'
import { formatDate } from '../../lib/utils'
import { setTicketStatus, upsertTicket } from '../../store/platformSlice'
import { newTicket, nextTicketNumber } from '../../lib/factories'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { SupportTicket, TicketPriority, TicketStatus } from '../../types/common.types'

function preview(text: string, max = 90) {
  const clean = text.trim().replace(/\s+/g, ' ')
  if (!clean) return 'No description'
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

export function SupportPage() {
  const tickets = useAppSelector((state) => state.platform.tickets)
  const companies = useAppSelector((state) => state.platform.companies)
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all')
  const [draft, setDraft] = useState<SupportTicket | null>(null)
  const [viewing, setViewing] = useState<SupportTicket | null>(null)

  const rows = useMemo(() => {
    if (filter === 'all') return tickets
    return tickets.filter((ticket) => ticket.status === filter)
  }, [tickets, filter])

  const openCount = tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'pending').length

  const startNewTicket = () => {
    const company = companies[0]
    setDraft(
      newTicket(
        company?.id ?? '',
        nextTicketNumber(tickets),
        company?.ownerEmail ?? ''
      )
    )
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Support"
        subtitle={`${openCount} open`}
        action={
          <Button onClick={startNewTicket}>
            <Plus className="w-4 h-4" />
            New ticket
          </Button>
        }
      />

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
            <Th>Ticket #</Th>
            <Th>Subject</Th>
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
              <tr
                key={ticket.id}
                className="hover:bg-[#F8FAFC]/80 cursor-pointer"
                onClick={() => setViewing(ticket)}
              >
                <Td className="font-semibold tabular-nums text-[#171A1F] whitespace-nowrap">
                  {ticket.number}
                </Td>
                <Td>
                  <p className="font-semibold text-[#171A1F]">{ticket.subject}</p>
                  <p className="text-xs text-[#68707C] mt-1 leading-relaxed line-clamp-2 max-w-md">
                    {preview(ticket.body)}
                  </p>
                </Td>
                <Td>
                  {company ? (
                    <Link
                      to={`/companies/${company.id}`}
                      className="text-sm font-semibold text-[#1677FF] hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
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
                  <div className="flex justify-end gap-1.5" onClick={(event) => event.stopPropagation()}>
                    <IconButton label="View ticket" tone="blue" onClick={() => setViewing(ticket)}>
                      <Eye className="w-3.5 h-3.5" />
                    </IconButton>
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
          {rows.length === 0 ? (
            <tr>
              <Td colSpan={7} className="text-center text-[#68707C] py-10">
                No tickets in this filter
              </Td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <Modal
        title={viewing ? `${viewing.number} · ${viewing.subject}` : 'Ticket'}
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        wide
      >
        {viewing ? (
          <TicketDetail
            ticket={viewing}
            companyName={companies.find((c) => c.id === viewing.companyId)?.name}
            companyId={viewing.companyId}
            onStatus={(status) => {
              dispatch(setTicketStatus({ id: viewing.id, status }))
              setViewing({
                ...viewing,
                status,
                updatedAt: new Date().toISOString().slice(0, 10),
              })
            }}
            onClose={() => setViewing(null)}
          />
        ) : null}
      </Modal>

      <Modal
        title={draft ? `New ticket · ${draft.number}` : 'New ticket'}
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        wide
      >
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.subject.trim() || !draft.companyId || !draft.body.trim()) return
              const company = companies.find((item) => item.id === draft.companyId)
              dispatch(
                upsertTicket({
                  ...draft,
                  requester: company?.ownerEmail ?? draft.requester,
                })
              )
              setDraft(null)
            }}
          >
            <Select
              label="Company"
              value={draft.companyId}
              onChange={(e) => {
                const company = companies.find((item) => item.id === e.target.value)
                setDraft({
                  ...draft,
                  companyId: e.target.value,
                  requester: company?.ownerEmail ?? '',
                })
              }}
              options={companies.map((company) => ({ value: company.id, label: company.name }))}
            />
            <Input
              label="Subject"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Short title, e.g. Owner locked out"
            />
            <TextArea
              label="Description"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              placeholder="What happened, who is affected, and what you already tried…"
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

function TicketDetail({
  ticket,
  companyName,
  companyId,
  onStatus,
  onClose,
}: {
  ticket: SupportTicket
  companyName?: string
  companyId: string
  onStatus: (status: TicketStatus) => void
  onClose: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={ticketTone(ticket.status)}>{ticket.status}</Badge>
        <Badge tone={ticket.priority === 'high' ? 'amber' : 'slate'}>{`${ticket.priority} priority`}</Badge>
        <span className="text-xs text-[#68707C]">Updated {formatDate(ticket.updatedAt)}</span>
      </div>

      <div className="rounded-2xl border border-[#EAEDF1] bg-[#F8FAFC] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] mb-2">Description</p>
        <p className="text-sm text-[#171A1F] leading-relaxed whitespace-pre-wrap">
          {ticket.body.trim() || 'No description provided.'}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">Company</p>
        {companyName ? (
          <Link
            to={`/companies/${companyId}`}
            className="mt-1 inline-block font-semibold text-[#1677FF] hover:underline"
          >
            {companyName}
          </Link>
        ) : (
          <p className="mt-1 text-[#68707C]">—</p>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {ticket.status !== 'resolved' ? (
          <>
            {ticket.status !== 'pending' ? (
              <Button variant="secondary" onClick={() => onStatus('pending')}>
                Mark pending
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => onStatus('open')}>
                Back to open
              </Button>
            )}
            <Button onClick={() => onStatus('resolved')}>Resolve</Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => onStatus('open')}>
            Reopen
          </Button>
        )}
      </div>
    </div>
  )
}
