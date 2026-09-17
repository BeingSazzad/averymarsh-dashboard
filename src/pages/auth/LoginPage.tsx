import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('sazzad@lattice.build')
  const [password, setPassword] = useState('lattice')
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4">
      <form
        className="w-full max-w-sm bg-white border border-[#DDE1E7] rounded-3xl p-6 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          try {
            setError('')
            login(email, password)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not sign in')
          }
        }}
      >
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.18em] text-[#1677FF]">LATTICE</p>
          <h1 className="text-xl font-bold text-[#171A1F] mt-1">Admin dashboard</h1>
          <p className="text-sm text-[#68707C] mt-1">Companies, seats, and billing.</p>
        </div>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-xs text-[#E5484D]">{error}</p> : null}
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  )
}
