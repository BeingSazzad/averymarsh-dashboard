import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Badge } from '../../components/shared/Badge'
import { CompanyMark } from '../../components/shared/CompanyMark'
import { Input } from '../../components/ui/Input'
import { Table, Td, Th } from '../../components/ui/Table'
import { useDebounce } from '../../hooks/useDebounce'
import { formatDate } from '../../lib/utils'
import { useAppSelector } from '../../store/hooks'

export function UsersPage() {
  const users = useAppSelector((state) => state.platform.users)
  const companies = useAppSelector((state) => state.platform.companies)
  const people = companies.reduce((sum, company) => sum + company.people, 0)
  const [query, setQuery] = useState('')
  const q = useDebounce(query)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users.filter((user) =>
      !needle
        ? true
        : user.name.toLowerCase().includes(needle) ||
          user.email.toLowerCase().includes(needle) ||
          (companies.find((company) => company.id === user.companyId)?.name ?? '')
            .toLowerCase()
            .includes(needle)
    )
  }, [users, q, companies])

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Users"
        subtitle={`${people} people on tenants · ${users.length} in this directory`}
        action={
          <div className="w-72">
            <Input placeholder="Search name, email, company" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        }
      />
      <Table>
        <thead>
          <tr>
            <Th>Person</Th>
            <Th>Company</Th>
            <Th>Role</Th>
            <Th>Last active</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((user) => {
            const company = companies.find((item) => item.id === user.companyId)
            return (
              <tr key={user.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src=""
                      name={user.name}
                      size={36}
                    />
                    <div>
                      <p className="font-semibold text-[#171A1F]">{user.name}</p>
                      <p className="text-xs text-[#68707C] mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  {company ? (
                    <div className="flex items-center gap-2.5">
                      <CompanyMark name={company.name} logo={company.logo} size={28} />
                      <span className="text-[#68707C] font-medium">{company.name}</span>
                    </div>
                  ) : (
                    '—'
                  )}
                </Td>
                <Td>
                  <Badge tone="slate">{user.role}</Badge>
                </Td>
                <Td className="text-[#68707C]">{formatDate(user.lastActive)}</Td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
