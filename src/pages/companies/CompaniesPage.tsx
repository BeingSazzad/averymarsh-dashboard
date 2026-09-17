import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, PauseCircle, Pencil, PlayCircle, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { CompanyMark } from '../../components/shared/CompanyMark'
import { SeatMeter } from '../../components/shared/SeatMeter'
import { SuspendConfirm } from '../../components/shared/SuspendConfirm'
import { Button } from '../../components/ui/Button'
import { IconButton } from '../../components/ui/IconButton'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import { Select } from '../../components/ui/Select'
import { Table, Td, Th } from '../../components/ui/Table'
import { companyPath } from '../../constants/routes'
import { usePagination } from '../../hooks/usePagination'
import { companyLabel, companyTone } from '../../lib/status'
import { classNames, formatDate, money } from '../../lib/utils'
import {
  deleteCompany,
  grantAccess,
  renameCompany,
  setCompanyStatus,
} from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { AccessMethod, Company } from '../../types/common.types'

type ModalMode =
  | { type: 'rename' | 'delete' | 'suspend'; company: Company }
  | { type: 'grant' }

export function CompaniesPage() {
  const navigate = useNavigate()
  const companies = useAppSelector((state) => state.platform.companies)
  const plans = useAppSelector((state) => state.platform.plans)
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

  const { page, setPage, pageCount, pageItems, total, from, to } = usePagination(rows, 10, query)

  const totalPeople = companies.reduce((sum, company) => sum + company.people, 0)

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} companies · ${totalPeople} people`}
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

      <Table
        footer={
          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            from={from}
            to={to}
            onPageChange={setPage}
          />
        }
      >
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
          {pageItems.map((company) => {
            return (
              <tr key={company.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                <Td>
                  <Link to={companyPath(company.id)} className="flex items-center gap-3 min-w-[240px] group">
                    <CompanyMark name={company.name} logo={company.logo} />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF]">
                        {company.name}
                      </p>
                      <p className="text-xs text-[#68707C] mt-0.5 truncate">{company.ownerEmail}</p>
                    </div>
                  </Link>
                </Td>
                <Td className="text-[#68707C] font-medium">
                  {plans.find((plan) => plan.id === company.planId)?.name ?? '—'}
                </Td>
                <Td>
                  <SeatMeter people={company.people} seats={company.seats} />
                </Td>
                <Td className="font-bold tabular-nums text-[#171A1F]">{money(company.mrr)}</Td>
                <Td className="text-[#68707C] whitespace-nowrap">{formatDate(company.renewsOn)}</Td>
                <Td>
                  <Badge tone={companyTone(company.status)}>{companyLabel(company.status)}</Badge>
                </Td>
                <Td>
                  <div className="flex justify-end gap-1.5">
                    <IconButton
                      label="Open company"
                      tone="blue"
                      onClick={() => navigate(companyPath(company.id))}
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
                    {company.status === 'suspended' ? (
                      <IconButton
                        label="Restore access"
                        tone="blue"
                        onClick={() => dispatch(setCompanyStatus({ id: company.id, status: 'active' }))}
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                      </IconButton>
                    ) : (
                      <IconButton
                        label="Suspend"
                        tone="danger"
                        onClick={() => setModal({ type: 'suspend', company })}
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                      </IconButton>
                    )}
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
          {pageItems.length === 0 ? (
            <tr>
              <Td colSpan={7} className="text-center text-[#68707C] py-10">
                No companies match your search
              </Td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <Modal
        title={
          modal?.type === 'grant'
            ? 'Grant Lattice access'
            : modal?.type === 'rename'
              ? 'Rename company'
              : modal?.type === 'delete'
                ? 'Delete company'
                : modal?.type === 'suspend'
                  ? 'Suspend company'
                  : ''
        }
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        wide={modal?.type === 'grant'}
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
                    ? `Invite sent to ${grant.ownerEmail}`
                    : `Login ready · ${grant.ownerEmail} · ${grant.tempPassword}`
                )
              }}
            >
              <Input
                label="Company name"
                value={grant.companyName}
                onChange={(e) => setGrant({ ...grant, companyName: e.target.value })}
                placeholder="Company name"
              />
              <Select
                label="Plan"
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
                />
                <Input
                  label="Owner email"
                  type="email"
                  value={grant.ownerEmail}
                  onChange={(e) => setGrant({ ...grant, ownerEmail: e.target.value })}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#171A1F] mb-1.5">Access</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'invite' as const, title: 'Send invite' },
                      { id: 'credentials' as const, title: 'Create login' },
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

        {modal?.type === 'suspend' ? (
          <SuspendConfirm
            companyName={modal.company.name}
            people={modal.company.people}
            onCancel={() => setModal(null)}
            onConfirm={() => {
              dispatch(setCompanyStatus({ id: modal.company.id, status: 'suspended' }))
              setModal(null)
            }}
          />
        ) : null}
      </Modal>
    </div>
  )
}
