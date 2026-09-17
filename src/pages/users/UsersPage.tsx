import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Input } from '../../components/ui/Input'
import { useDebounce } from '../../hooks/useDebounce'
import { useAppSelector } from '../../store/hooks'

export function UsersPage() {
  const users = useAppSelector((state) => state.platform.users)
  const companies = useAppSelector((state) => state.platform.companies)
  const [query, setQuery] = useState('')
  const q = useDebounce(query)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users.filter((user) =>
      !needle
        ? true
        : user.name.toLowerCase().includes(needle) || user.email.toLowerCase().includes(needle)
    )
  }, [users, q])

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} seats across companies`} />
      <div className="max-w-sm mb-4">
        <Input placeholder="Search name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="rounded-2xl bg-white border border-[#DDE1E7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2F2F7] text-[#68707C] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold px-4 py-3">User</th>
              <th className="text-left font-semibold px-4 py-3">Company</th>
              <th className="text-left font-semibold px-4 py-3">Role</th>
              <th className="text-left font-semibold px-4 py-3">Last active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id} className="border-t border-[#EAEDF1]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#171A1F]">{user.name}</p>
                  <p className="text-xs text-[#68707C]">{user.email}</p>
                </td>
                <td className="px-4 py-3 text-[#68707C]">
                  {companies.find((company) => company.id === user.companyId)?.name ?? '—'}
                </td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 text-[#68707C]">{user.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
