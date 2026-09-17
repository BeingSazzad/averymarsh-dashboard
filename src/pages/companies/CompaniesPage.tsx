import { useMemo, useState } from 'react'
import { Eye, Pencil, RefreshCw, Trash2, Users } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { CompanyMark } from '../../components/shared/CompanyMark'
import { SeatMeter } from '../../components/shared/SeatMeter'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Table, Td, Th } from '../../components/ui/Table'
import { companyLabel, companyTone } from '../../lib/status'
import { formatDate, money } from '../../lib/utils'
import { deleteCompany, renameCompany, renewCompany } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Company } from '../../types/common.types'

type ModalMode = { type: 'track' | 'rename' | 'delete'; company: Company }

export function CompaniesPage() {
  const companies = useAppSelector((state) => state.platform.companies)
  const plans = useAppSelector((state) => state.platform.plans)
  const users = useAppSelector((state) => state.platform.users)
  const dispatch = useAppDispatch()
  const [modal, setModal] = useState<ModalMode | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [query, setQuery] = useState('')

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
    <div className="flex flex-col gap-5 max-w-[1280px]">
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} tenants · ${totalPeople} people on Lattice`}
        action={
          <div className="w-64">
            <Input placeholder="Search companies" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        }
      />

      <Table>
        <thead>
          <tr>
            <Th>Company</Th>
            <Th>Plan</Th>
            <Th>People</Th>
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
                  <div className="flex items-center gap-3 min-w-[220px]">
                    <CompanyMark name={company.name} />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#171A1F] truncate">{company.name}</p>
                      <p className="text-xs text-[#68707C] mt-0.5">Joined {formatDate(company.joined)}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-[#68707C] font-medium">
                  {plans.find((plan) => plan.id === company.planId)?.name ?? '—'}
                </Td>
                <Td>
                  <div className="flex flex-col gap-1">
                    <SeatMeter people={company.people} seats={company.seats} />
                    <p className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {directoryCount} in directory
                    </p>
                  </div>
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
          modal?.type === 'track'
            ? `People · ${modal.company.name}`
            : modal?.type === 'rename'
              ? 'Rename company'
              : modal?.type === 'delete'
                ? 'Delete company'
                : ''
        }
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        wide={modal?.type === 'track'}
      >
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
              {modal.company.people} people from Lattice? Billing history for this tenant is cleared in this session.
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
