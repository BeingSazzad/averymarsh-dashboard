import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Badge } from '../../components/shared/Badge'
import { PermissionGate } from '../../components/shared/PermissionGate'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { deleteAdmin, newAdmin, upsertAdmin } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Admin } from '../../types/common.types'

export function AdminsPage() {
  const admins = useAppSelector((state) => state.platform.admins)
  const session = useAppSelector((state) => state.platform.session)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<Admin | null>(null)

  return (
    <div>
      <PageHeader
        title="Admins"
        subtitle="People who can operate this dashboard"
        action={<Button onClick={() => setDraft(newAdmin())}>Add admin</Button>}
      />
      <div className="rounded-2xl bg-white border border-[#DDE1E7] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2F2F7] text-[#68707C] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold px-4 py-3">Admin</th>
              <th className="text-left font-semibold px-4 py-3">Role</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
              <th className="text-right font-semibold px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t border-[#EAEDF1]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={admin.avatar} name={admin.name} />
                    <div>
                      <p className="font-semibold text-[#171A1F]">{admin.name}</p>
                      <p className="text-xs text-[#68707C]">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{admin.role}</td>
                <td className="px-4 py-3">
                  <Badge tone={admin.status === 'active' ? 'green' : 'blue'}>{admin.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setDraft(admin)}>Edit</Button>
                    <PermissionGate allow={admin.id !== session?.id}>
                      <Button variant="danger" onClick={() => dispatch(deleteAdmin(admin.id))}>Delete</Button>
                    </PermissionGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title="Admin" open={Boolean(draft)} onClose={() => setDraft(null)}>
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.name.trim() || !draft.email.trim()) return
              dispatch(upsertAdmin(draft))
              setDraft(null)
            }}
          >
            <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            <Select
              label="Role"
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value as Admin['role'] })}
              options={[
                { value: 'Owner', label: 'Owner' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Finance', label: 'Finance' },
              ]}
            />
            <Button type="submit">Save admin</Button>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}
