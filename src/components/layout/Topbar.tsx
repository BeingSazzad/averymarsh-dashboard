import { Bell, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { readSession } from '../../hooks/useAuth'
import { useAppSelector } from '../../store/hooks'
import { Avatar } from '../shared/Avatar'
import { MobileNav } from './Sidebar'

export function Topbar() {
  const session = useAppSelector((state) => state.platform.session) ?? readSession()
  const admins = useAppSelector((state) => state.platform.admins)
  const unread = useAppSelector(
    (state) => state.platform.notifications.filter((note) => !note.read).length
  )
  const role = admins.find((admin) => admin.id === session?.id)?.role ?? 'Admin'

  return (
    <header className="bg-white/90 backdrop-blur border-b border-[#EAEDF1] shrink-0">
      <div className="h-[68px] px-5 md:px-8 lg:px-10 flex items-center justify-end gap-2.5">
        <Link
          to={ROUTES.notifications}
          className="relative w-11 h-11 rounded-2xl border border-[#DDE1E7] bg-white flex items-center justify-center text-[#171A1F] hover:bg-[#F2F2F7] transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" strokeWidth={1.9} />
          {unread > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#1677FF] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {unread}
            </span>
          ) : null}
        </Link>

        {session ? (
          <Link
            to={ROUTES.profile}
            className="h-11 pl-1.5 pr-2.5 rounded-2xl border border-[#DDE1E7] bg-white flex items-center gap-2.5 min-w-0 hover:bg-[#F8FAFC] transition"
          >
            <Avatar src={session.avatar} name={session.name} size={32} />
            <div className="hidden sm:block min-w-0 text-left">
              <p className="text-sm font-semibold text-[#171A1F] truncate leading-tight max-w-[140px]">
                {session.name}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] leading-tight">
                {role}
              </p>
            </div>
            <ChevronDown className="hidden sm:block w-4 h-4 text-[#68707C] shrink-0 ml-0.5" />
          </Link>
        ) : null}
      </div>
      <MobileNav />
    </header>
  )
}
