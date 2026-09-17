import { useRef, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { SESSION_KEY } from '../../lib/constants'
import { updateSession } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export function ProfilePage() {
  const session = useAppSelector((state) => state.platform.session)
  const dispatch = useAppDispatch()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(session?.name ?? '')
  const [email, setEmail] = useState(session?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [message, setMessage] = useState('')

  if (!session) return null

  const persist = (patch: { name?: string; email?: string; avatar?: string }) => {
    const next = { ...session, ...patch }
    dispatch(updateSession(patch))
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Your profile" subtitle="Photo, name, and password" />
      <div className="rounded-2xl bg-white border border-[#DDE1E7] p-5 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar src={session.avatar} name={session.name} size={72} />
          <div>
            <p className="text-sm font-semibold text-[#171A1F]">{session.name}</p>
            <Button variant="secondary" className="mt-2" type="button" onClick={() => fileRef.current?.click()}>
              Change photo
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === 'string') persist({ avatar: reader.result })
                }
                reader.readAsDataURL(file)
              }}
            />
          </div>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            persist({ name: name.trim() || session.name, email: email.trim() || session.email })
            setMessage('Profile saved')
          }}
        >
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit">Save profile</Button>
        </form>

        <form
          className="flex flex-col gap-3 pt-4 border-t border-[#EAEDF1]"
          onSubmit={(event) => {
            event.preventDefault()
            if (currentPassword.length < 4 || nextPassword.length < 4) {
              setMessage('Both passwords need 4+ characters')
              return
            }
            setCurrentPassword('')
            setNextPassword('')
            setMessage('Password updated')
          }}
        >
          <p className="text-sm font-bold text-[#171A1F]">Password</p>
          <Input label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input label="New password" type="password" value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} />
          <Button type="submit">Change password</Button>
        </form>
        {message ? <p className="text-sm text-[#1677FF]">{message}</p> : null}
      </div>
    </div>
  )
}
