import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { LatticeLogo } from '../../components/shared/LatticeLogo'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('sazzad@lattice.build')
  const [password, setPassword] = useState('lattice')
  const [error, setError] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_10%,rgba(22,119,255,0.14),transparent_55%),radial-gradient(700px_420px_at_90%_80%,rgba(0,210,255,0.1),transparent_50%)]" />
      <form
        className="relative w-full max-w-[400px] bg-white/95 backdrop-blur border border-[#DDE1E7] rounded-[28px] p-8 flex flex-col gap-5 shadow-[0_24px_60px_rgba(23,26,31,0.08)]"
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
        <LatticeLogo size="md" />
        <div>
          <h1 className="text-xl font-bold text-[#171A1F] tracking-tight">Admin sign in</h1>
          <p className="text-sm text-[#68707C] mt-1.5 leading-relaxed">
            Manage companies, seats, plans, and billing for Lattice.
          </p>
        </div>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-xs text-[#E5484D]">{error}</p> : null}
        <Button type="submit" className="w-full h-11 rounded-2xl">
          Sign in
        </Button>
      </form>
    </div>
  )
}
