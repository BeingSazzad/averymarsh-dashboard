import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Badge } from '../../components/shared/Badge'
import { PermissionGate } from '../../components/shared/PermissionGate'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Table, Td, Th } from '../../components/ui/Table'
import { deleteAdmin, newAdmin, upsertAdmin } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Admin } from '../../types/common.types'

export function AdminsPage() {
  const admins = useAppSelector((state) => state.platform.admins)
  const session = useAppSelector((state) => state.platform.session)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<Admin | null>(null)

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Admins"
        subtitle="People who operate this dashboard"
        action={<Button onClick={() => setDraft(newAdmin())}>Add admin</Button>}
      />
      <Table>
        <thead>
          <tr>
            <Th>Admin</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-[#F8FAFC]">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar src={admin.avatar} name={admin.name} />
                  <div>
                    <p className="font-semibold text-[#171A1F]">{admin.name}</p>
                    <p className="text-xs text-[#68707C] mt-0.5">{admin.email}</p>
                  </div>
                </div>
              </Td>
              <Td>{admin.role}</Td>
              <Td>
                <Badge tone={admin.status === 'active' ? 'green' : 'blue'}>{admin.status}</Badge>
              </Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setDraft(admin)}>
                    Edit
                  </Button>
                  <PermissionGate allow={admin.id !== session?.id}>
                    <Button size="sm" variant="danger" onClick={() => dispatch(deleteAdmin(admin.id))}>
                      Delete
                    </Button>
                  </PermissionGate>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

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
