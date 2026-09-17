import {
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'
import { ROUTES } from './routes'

export const NAV_ITEMS = [
  { to: ROUTES.overview, label: 'Overview', icon: LayoutDashboard },
  { to: ROUTES.companies, label: 'Companies', icon: Building2 },
  { to: ROUTES.users, label: 'Users', icon: Users },
  { to: ROUTES.plans, label: 'Plans', icon: Wallet },
  { to: ROUTES.billing, label: 'Billing', icon: CreditCard },
  { to: ROUTES.support, label: 'Support', icon: LifeBuoy },
  { to: ROUTES.cms, label: 'CMS', icon: FileText },
  { to: ROUTES.admins, label: 'Admins', icon: Shield },
] as const
