import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { classNames } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'
import { LatticeLogo } from '../shared/LatticeLogo'

export const NAV_ITEMS = [
  { to: ROUTES.overview, label: 'Overview', icon: LayoutDashboard },
  { to: ROUTES.companies, label: 'Companies', icon: Building2 },
  { to: ROUTES.users, label: 'Users', icon: Users },
  { to: ROUTES.plans, label: 'Plans', icon: Wallet },
  { to: ROUTES.billing, label: 'Billing', icon: CreditCard },
  { to: ROUTES.support, label: 'Support', icon: LifeBuoy },
  { to: ROUTES.cms, label: 'CMS', icon: FileText },
  { to: ROUTES.admins, label: 'Admins', icon: Shield },
]

export function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="hidden md:flex w-[232px] shrink-0 h-screen sticky top-0 flex-col bg-white/90 backdrop-blur border-r border-[#DDE1E7]">
      <div className="h-[68px] px-5 flex items-center border-b border-[#EAEDF1]">
        <LatticeLogo size="sm" />
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
          Control
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.overview}
              className={({ isActive }) =>
                classNames(
                  'relative h-10 px-3 rounded-xl flex items-center gap-3 text-[13px] cursor-pointer transition-colors',
                  isActive
                    ? 'bg-[#EAF3FF] text-[#1677FF] font-semibold'
                    : 'text-[#68707C] hover:bg-[#F2F2F7] hover:text-[#171A1F] font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#1677FF]" />
                  ) : null}
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.9} />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#EAEDF1]">
        <button
          type="button"
          onClick={logout}
          className="h-10 w-full px-3 rounded-xl flex items-center gap-3 text-[13px] font-medium text-[#68707C] hover:bg-[#FFF0F0] hover:text-[#E5484D] cursor-pointer transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.9} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const { logout } = useAuth()
  return (
    <div className="md:hidden flex gap-1.5 overflow-x-auto px-3 py-2.5 bg-white border-b border-[#EAEDF1]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ROUTES.overview}
          className={({ isActive }) =>
            classNames(
              'h-8 px-3 rounded-lg text-xs whitespace-nowrap flex items-center gap-1.5',
              isActive ? 'bg-[#EAF3FF] text-[#1677FF] font-semibold' : 'text-[#68707C] font-medium'
            )
          }
        >
          <item.icon className="w-3.5 h-3.5" />
          {item.label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={logout}
        className="h-8 px-3 rounded-lg text-xs whitespace-nowrap text-[#E5484D] font-medium cursor-pointer"
      >
        Sign out
      </button>
    </div>
  )
}

interface ShellProps {
  children: ReactNode
}

export function AppShell({ children }: ShellProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  )
}
