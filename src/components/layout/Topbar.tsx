import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../shared/Avatar'
import { Button } from '../ui/Button'
import { MobileNav } from './Sidebar'

export function Topbar() {
  const { session, logout } = useAuth()
  return (
    <header className="bg-white border-b border-[#DDE1E7]">
      <div className="h-16 px-4 md:px-6 flex items-center gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search companies, users, invoices"
            className="w-full h-10 rounded-xl border border-[#DDE1E7] bg-[#F2F2F7] pl-9 pr-3 text-sm outline-none focus:border-[#1677FF] focus:bg-white"
          />
        </div>
        <button type="button" className="w-10 h-10 rounded-xl border border-[#DDE1E7] flex items-center justify-center text-[#171A1F] cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
        {session ? (
          <Link to={ROUTES.profile} className="flex items-center gap-2 min-w-0">
            <Avatar src={session.avatar} name={session.name} />
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-semibold text-[#171A1F] truncate">{session.name}</p>
              <p className="text-[11px] text-[#68707C] truncate">Profile</p>
            </div>
          </Link>
        ) : null}
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
      <MobileNav />
    </header>
  )
}
