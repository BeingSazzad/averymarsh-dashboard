import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Building2, CreditCard, FileText, LayoutDashboard, Shield, Users, Wallet,
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { classNames } from '../../lib/utils'

const items = [
  { to: ROUTES.overview, label: 'Overview', icon: LayoutDashboard },
  { to: ROUTES.companies, label: 'Companies', icon: Building2 },
  { to: ROUTES.users, label: 'Users', icon: Users },
  { to: ROUTES.plans, label: 'Plans', icon: Wallet },
  { to: ROUTES.billing, label: 'Billing', icon: CreditCard },
  { to: ROUTES.cms, label: 'CMS', icon: FileText },
  { to: ROUTES.admins, label: 'Admins', icon: Shield },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white border-r border-[#DDE1E7]">
      <div className="h-16 px-5 flex items-center gap-2 border-b border-[#DDE1E7]">
        <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
        <span className="text-xs font-extrabold tracking-[0.18em] text-[#171A1F]">LATTICE</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.overview}
              className={({ isActive }) =>
                classNames(
                  'h-10 px-3 rounded-xl flex items-center gap-3 text-sm cursor-pointer',
                  isActive
                    ? 'bg-[#EAF3FF] text-[#1677FF] font-semibold'
                    : 'text-[#68707C] hover:bg-[#F2F2F7] hover:text-[#171A1F] font-medium'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      <p className="px-5 py-4 text-[11px] text-[#68707C]">SaaS control center</p>
    </aside>
  )
}

export function MobileNav() {
  return (
    <div className="md:hidden flex gap-1 overflow-x-auto px-3 py-2 bg-white border-b border-[#DDE1E7]">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ROUTES.overview}
          className={({ isActive }) =>
            classNames(
              'h-9 px-3 rounded-lg text-xs whitespace-nowrap flex items-center',
              isActive ? 'bg-[#EAF3FF] text-[#1677FF] font-semibold' : 'text-[#68707C]'
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

interface ShellProps {
  children: ReactNode
}

export function AppShell({ children }: ShellProps) {
  return (
    <div className="min-h-screen flex bg-[#F2F2F7]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  )
}
