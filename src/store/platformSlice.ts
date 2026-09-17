import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { addOneYear, uid } from '../lib/utils'
import {
  seedAdmins,
  seedCompanies,
  seedFaqs,
  seedInvoices,
  seedLegal,
  seedNotifications,
  seedPlans,
  seedTickets,
  seedUsers,
} from '../lib/seed'
import type {
  Admin,
  AppNotification,
  Company,
  FaqItem,
  GrantAccessPayload,
  Invoice,
  LegalDoc,
  Plan,
  SeatUser,
  SessionAdmin,
  SupportTicket,
  TicketStatus,
} from '../types/common.types'

export interface PlatformState {
  year: number
  session: SessionAdmin | null
  plans: Plan[]
  companies: Company[]
  users: SeatUser[]
  invoices: Invoice[]
  faqs: FaqItem[]
  legal: LegalDoc[]
  admins: Admin[]
  notifications: AppNotification[]
  tickets: SupportTicket[]
}

const initialState: PlatformState = {
  year: 2026,
  session: null,
  plans: seedPlans,
  companies: seedCompanies,
  users: seedUsers,
  invoices: seedInvoices,
  faqs: seedFaqs,
  legal: seedLegal,
  admins: seedAdmins,
  notifications: seedNotifications,
  tickets: seedTickets,
}

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload
    },
    setSession(state, action: PayloadAction<SessionAdmin | null>) {
      state.session = action.payload
    },
    updateSession(state, action: PayloadAction<Partial<SessionAdmin>>) {
      if (!state.session) return
      state.session = { ...state.session, ...action.payload }
      state.admins = state.admins.map((admin) =>
        admin.id === state.session?.id
          ? { ...admin, name: state.session.name, email: state.session.email, avatar: state.session.avatar }
          : admin
      )
    },
    upsertPlan(state, action: PayloadAction<Plan>) {
      const index = state.plans.findIndex((plan) => plan.id === action.payload.id)
      if (index >= 0) state.plans[index] = action.payload
      else state.plans.push(action.payload)
    },
    deletePlan(state, action: PayloadAction<string>) {
      state.plans = state.plans.filter((plan) => plan.id !== action.payload)
    },
    upsertFaq(state, action: PayloadAction<FaqItem>) {
      const index = state.faqs.findIndex((item) => item.id === action.payload.id)
      if (index >= 0) state.faqs[index] = action.payload
      else state.faqs.push(action.payload)
    },
    deleteFaq(state, action: PayloadAction<string>) {
      state.faqs = state.faqs.filter((item) => item.id !== action.payload)
    },
    saveLegal(state, action: PayloadAction<LegalDoc>) {
      const index = state.legal.findIndex((doc) => doc.id === action.payload.id)
      if (index >= 0) state.legal[index] = action.payload
      else state.legal.push(action.payload)
    },
    upsertAdmin(state, action: PayloadAction<Admin>) {
      const index = state.admins.findIndex((admin) => admin.id === action.payload.id)
      if (index >= 0) state.admins[index] = action.payload
      else state.admins.push(action.payload)
    },
    deleteAdmin(state, action: PayloadAction<string>) {
      state.admins = state.admins.filter((admin) => admin.id !== action.payload)
    },
    renameCompany(state, action: PayloadAction<{ id: string; name: string }>) {
      const company = state.companies.find((item) => item.id === action.payload.id)
      if (!company) return
      const next = action.payload.name.trim()
      if (!next) return
      company.name = next
    },
    renewCompany(state, action: PayloadAction<string>) {
      const company = state.companies.find((item) => item.id === action.payload)
      if (!company) return
      const plan = state.plans.find((item) => item.id === company.planId)
      company.status = 'active'
      company.mrr = plan?.monthlyPrice ?? company.mrr
      company.renewsOn = addOneYear(company.renewsOn)
    },
    deleteCompany(state, action: PayloadAction<string>) {
      state.companies = state.companies.filter((company) => company.id !== action.payload)
      state.users = state.users.filter((user) => user.companyId !== action.payload)
      state.invoices = state.invoices.filter((invoice) => invoice.companyId !== action.payload)
    },
    grantAccess(state, action: PayloadAction<GrantAccessPayload>) {
      const plan = state.plans.find((item) => item.id === action.payload.planId)
      if (!plan || !action.payload.companyName.trim() || !action.payload.ownerEmail.trim()) return

      const companyId = uid('co')
      const today = new Date().toISOString().slice(0, 10)
      const renewsOn = addOneYear(today)

      state.companies.unshift({
        id: companyId,
        name: action.payload.companyName.trim(),
        planId: plan.id,
        seats: plan.seats,
        people: 1,
        status: 'active',
        mrr: plan.monthlyPrice,
        joined: today,
        renewsOn,
        logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=160&h=160&fit=crop&q=80',
        ownerEmail: action.payload.ownerEmail.trim().toLowerCase(),
        accessMethod: action.payload.accessMethod,
      })

      state.users.unshift({
        id: uid('u'),
        name: action.payload.ownerName.trim() || 'Company Owner',
        email: action.payload.ownerEmail.trim().toLowerCase(),
        companyId,
        role: 'Owner',
        lastActive: today,
      })

      state.notifications.unshift({
        id: uid('n'),
        kind: 'access',
        title:
          action.payload.accessMethod === 'invite'
            ? `Invite sent · ${action.payload.companyName.trim()}`
            : `Login created · ${action.payload.companyName.trim()}`,
        body:
          action.payload.accessMethod === 'invite'
            ? `Invite emailed to ${action.payload.ownerEmail.trim()}. They can open Lattice and set a password.`
            : `Temporary password set for ${action.payload.ownerEmail.trim()}. Share it securely, then ask them to change it.`,
        createdAt: new Date().toISOString(),
        read: false,
        href: '/companies',
      })
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const item = state.notifications.find((note) => note.id === action.payload)
      if (item) item.read = true
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((note) => {
        note.read = true
      })
    },
    resetUserPassword(state, action: PayloadAction<{ userId: string; tempPassword: string }>) {
      const user = state.users.find((item) => item.id === action.payload.userId)
      if (!user) return
      const company = state.companies.find((item) => item.id === user.companyId)
      state.notifications.unshift({
        id: uid('n'),
        kind: 'access',
        title: `Password reset · ${user.name}`,
        body: `Temp password for ${user.email}: ${action.payload.tempPassword}. Share once, then ask them to change it.`,
        createdAt: new Date().toISOString(),
        read: false,
        href: company ? `/companies/${company.id}` : '/users',
      })
    },
    upsertTicket(state, action: PayloadAction<SupportTicket>) {
      const index = state.tickets.findIndex((ticket) => ticket.id === action.payload.id)
      if (index >= 0) state.tickets[index] = action.payload
      else state.tickets.unshift(action.payload)
    },
    setTicketStatus(state, action: PayloadAction<{ id: string; status: TicketStatus }>) {
      const ticket = state.tickets.find((item) => item.id === action.payload.id)
      if (!ticket) return
      ticket.status = action.payload.status
      ticket.updatedAt = new Date().toISOString().slice(0, 10)
    },
  },
})

export const {
  setYear,
  setSession,
  updateSession,
  upsertPlan,
  deletePlan,
  upsertFaq,
  deleteFaq,
  saveLegal,
  upsertAdmin,
  deleteAdmin,
  renameCompany,
  renewCompany,
  deleteCompany,
  grantAccess,
  markNotificationRead,
  markAllNotificationsRead,
  resetUserPassword,
  upsertTicket,
  setTicketStatus,
} = platformSlice.actions

export const platformReducer = platformSlice.reducer

export function newPlan(): Plan {
  return {
    id: uid('plan'),
    name: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    seats: 5,
    active: true,
  }
}

export function newFaq(): FaqItem {
  return { id: uid('faq'), question: '', answer: '', published: false }
}

export function newAdmin(): Admin {
  return {
    id: uid('adm'),
    name: '',
    email: '',
    role: 'Admin',
    status: 'invited',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  }
}

export function newTicket(companyId: string): SupportTicket {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: uid('tkt'),
    companyId,
    subject: '',
    requester: '',
    status: 'open',
    priority: 'normal',
    createdAt: today,
    updatedAt: today,
    body: '',
  }
}

export function makeTempPassword(): string {
  return `Lat${Math.random().toString(36).slice(2, 6)}!${Math.floor(Math.random() * 90 + 10)}`
}
