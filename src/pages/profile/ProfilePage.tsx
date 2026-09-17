import { useRef, useState } from 'react'
import { Camera, Check, Lock, ShieldCheck, UserRound } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Avatar } from '../../components/shared/Avatar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PasswordField } from '../../components/ui/PasswordField'
import { SESSION_KEY } from '../../lib/constants'
import { classNames } from '../../lib/utils'
import { updateSession } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

type ProfileTab = 'personal' | 'security'

function ruleOk(ok: boolean, label: string) {
  return (
    <li className={classNames('flex items-center gap-2 text-xs', ok ? 'text-[#10A976]' : 'text-[#68707C]')}>
      <span
        className={classNames(
          'w-4 h-4 rounded-full flex items-center justify-center shrink-0',
          ok ? 'bg-[#E9F9F3] text-[#10A976]' : 'bg-[#EAEDF1] text-[#94A3B8]'
        )}
      >
        <Check className="w-2.5 h-2.5" strokeWidth={3} />
      </span>
      {label}
    </li>
  )
}

export function ProfilePage() {
  const session = useAppSelector((state) => state.platform.session)
  const dispatch = useAppDispatch()
  const fileRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<ProfileTab>('personal')
  const [name, setName] = useState(session?.name ?? '')
  const [email, setEmail] = useState(session?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  if (!session) return null

  const persist = (patch: { name?: string; email?: string; avatar?: string }) => {
    const next = { ...session, ...patch }
    dispatch(updateSession(patch))
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
  }

  const longEnough = nextPassword.length >= 8
  const hasLetter = /[A-Za-z]/.test(nextPassword)
  const hasNumber = /\d/.test(nextPassword)
  const matches = nextPassword.length > 0 && nextPassword === confirmPassword
  const passwordReady = longEnough && hasLetter && hasNumber && matches && currentPassword.length >= 4

  const tabs: Array<{ id: ProfileTab; label: string; icon: typeof UserRound }> = [
    { id: 'personal', label: 'Personal info', icon: UserRound },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl">
      <PageHeader title="Your profile" />

      <div className="flex flex-wrap gap-1 bg-[#EAEDF1] p-1 rounded-2xl w-fit">
        {tabs.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={classNames(
                'h-9 px-3.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5',
                tab === item.id ? 'bg-white text-[#1677FF] shadow-sm' : 'text-[#68707C]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'personal' ? (
        <section className="panel p-5 md:p-6 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar src={session.avatar} name={session.name} size={80} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1677FF] text-white flex items-center justify-center border-2 border-white cursor-pointer shadow-sm"
                aria-label="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-[#171A1F] truncate">{session.name}</p>
              <p className="text-sm text-[#68707C] truncate mt-0.5">{session.email}</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer"
              >
                Upload new photo
              </button>
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
                    if (typeof reader.result === 'string') {
                      persist({ avatar: reader.result })
                      setProfileMessage('Photo updated')
                    }
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
              setProfileMessage('Profile saved')
            }}
          >
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex items-center justify-between gap-3 pt-1">
              {profileMessage ? <p className="text-sm text-[#10A976] font-medium">{profileMessage}</p> : <span />}
              <Button type="submit" className="w-full sm:w-auto">
                Save profile
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {tab === 'security' ? (
        <section className="panel p-5 md:p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-[#171A1F]">Password</h2>
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              setPasswordError('')
              setPasswordMessage('')
              if (currentPassword.length < 4) {
                setPasswordError('Enter your current password')
                return
              }
              if (!passwordReady) {
                setPasswordError('New password does not meet the requirements')
                return
              }
              setCurrentPassword('')
              setNextPassword('')
              setConfirmPassword('')
              setPasswordMessage('Password updated successfully')
            }}
          >
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter current password"
            />
            <PasswordField
              label="New password"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Create new password"
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Repeat new password"
            />

            <div className="rounded-2xl bg-[#F8FAFC] border border-[#EAEDF1] p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <ShieldCheck className="w-4 h-4 text-[#68707C]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#68707C]">Requirements</p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ruleOk(longEnough, 'At least 8 characters')}
                {ruleOk(hasLetter, 'Contains a letter')}
                {ruleOk(hasNumber, 'Contains a number')}
                {ruleOk(matches, 'Passwords match')}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="min-h-5">
                {passwordError ? <p className="text-sm text-[#E5484D] font-medium">{passwordError}</p> : null}
                {passwordMessage ? <p className="text-sm text-[#10A976] font-medium">{passwordMessage}</p> : null}
              </div>
              <Button type="submit" disabled={!passwordReady} className="w-full sm:w-auto">
                Update password
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
