import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Table, Td, Th } from '../../components/ui/Table'
import { deleteAdmin, upsertAdmin } from '../../store/platformSlice'
import { newAdmin } from '../../lib/factories'
import { PermissionGate } from '../../components/shared/PermissionGate'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Admin } from '../../types/common.types'

export function AdminsPage() {
  const admins = useAppSelector((state) => state.platform.admins)
  const session = useAppSelector((state) => state.platform.session)
  const dispatch = useAppDispatch()
  const [draft, setDraft] = useState<Admin | null>(null)

  const isEditing = Boolean(draft && admins.some((admin) => admin.id === draft.id))

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Admins"
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
          {admins.map((admin) => {
            const isSuper = admin.role === 'Super Admin'
            const isSelf = admin.id === session?.id
            return (
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
                <Td>
                  <Badge tone={isSuper ? 'blue' : 'slate'}>{admin.role}</Badge>
                </Td>
                <Td>
                  <Badge tone={admin.status === 'active' ? 'green' : 'blue'}>{admin.status}</Badge>
                </Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    {!isSuper ? (
                      <Button size="sm" variant="secondary" onClick={() => setDraft(admin)}>
                        Edit
                      </Button>
                    ) : null}
                    <PermissionGate allow={!isSuper && !isSelf}>
                      <Button size="sm" variant="danger" onClick={() => dispatch(deleteAdmin(admin.id))}>
                        Delete
                      </Button>
                    </PermissionGate>
                  </div>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Modal title={isEditing ? 'Edit admin' : 'Add admin'} open={Boolean(draft)} onClose={() => setDraft(null)}>
        {draft ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.name.trim() || !draft.email.trim()) return
              dispatch(
                upsertAdmin({
                  ...draft,
                  role: 'Admin',
                  name: draft.name.trim(),
                  email: draft.email.trim().toLowerCase(),
                })
              )
              setDraft(null)
            }}
          >
            <Input
              label="Name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Full name"
            />
            <Input
              label="Email"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              placeholder="name@company.com"
            />
            <Button type="submit">{isEditing ? 'Save admin' : 'Add admin'}</Button>
          </form>
        ) : null}
      </Modal>
    </div>
  )
}
