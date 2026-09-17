export type CompanyStatus = 'trial' | 'active' | 'past_due' | 'canceled'
export type InvoiceStatus = 'paid' | 'failed' | 'open'
export type AdminStatus = 'active' | 'invited'
export type AccessMethod = 'invite' | 'credentials'
export type NotificationKind = 'payment' | 'trial' | 'access' | 'system'

export interface MonthlyPoint {
  month: string
  users: number
  subscriptions: number
  income: number
}

export interface Company {
  id: string
  name: string
  planId: string
  seats: number
  people: number
  status: CompanyStatus
  mrr: number
  joined: string
  renewsOn: string
  logo: string
  ownerEmail: string
  accessMethod: AccessMethod
}

export interface SeatUser {
  id: string
  name: string
  email: string
  companyId: string
  role: string
  lastActive: string
}

export interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  seats: number
  active: boolean
}

export interface Invoice {
  id: string
  companyId: string
  amount: number
  status: InvoiceStatus
  date: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  published: boolean
}

export interface LegalDoc {
  id: 'terms' | 'privacy' | 'about'
  title: string
  body: string
  updatedAt: string
}

export interface Admin {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Finance'
  status: AdminStatus
  avatar: string
}

export interface SessionAdmin {
  id: string
  name: string
  email: string
  avatar: string
}

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}

export interface GrantAccessPayload {
  companyName: string
  planId: string
  ownerName: string
  ownerEmail: string
  accessMethod: AccessMethod
  tempPassword?: string
}
