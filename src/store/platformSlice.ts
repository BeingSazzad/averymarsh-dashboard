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
  CompanyStatus,
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
      if (action.payload.role === 'Super Admin') return
      const index = state.admins.findIndex((admin) => admin.id === action.payload.id)
      if (index >= 0) {
        if (state.admins[index].role === 'Super Admin') return
        state.admins[index] = { ...action.payload, role: 'Admin' }
      } else {
        state.admins.push({ ...action.payload, role: 'Admin' })
      }
    },
    deleteAdmin(state, action: PayloadAction<string>) {
      const target = state.admins.find((admin) => admin.id === action.payload)
      if (!target || target.role === 'Super Admin') return
      if (state.session?.id === action.payload) return
      state.admins = state.admins.filter((admin) => admin.id !== action.payload)
    },
    renameCompany(state, action: PayloadAction<{ id: string; name: string }>) {
      const company = state.companies.find((item) => item.id === action.payload.id)
      if (!company) return
      const next = action.payload.name.trim()
      if (!next) return
      company.name = next
    },
    setCompanyStatus(state, action: PayloadAction<{ id: string; status: CompanyStatus }>) {
      const company = state.companies.find((item) => item.id === action.payload.id)
      if (!company) return
      const next = action.payload.status
      company.status = next
      if (next === 'canceled' || next === 'suspended') {
        company.mrr = 0
      } else if (next === 'active' || next === 'trial') {
        const plan = state.plans.find((item) => item.id === company.planId)
        company.mrr = plan?.monthlyPrice ?? company.mrr
      }
      state.notifications.unshift({
        id: uid('n'),
        kind: 'access',
        title: `${next === 'suspended' ? 'Suspended' : next === 'active' ? 'Restored' : 'Updated'} · ${company.name}`,
        body: company.name,
        createdAt: new Date().toISOString(),
        read: false,
        href: `/companies/${company.id}`,
      })
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
        joined: today,
      })

      state.notifications.unshift({
        id: uid('n'),
        kind: 'access',
        title:
          action.payload.accessMethod === 'invite'
            ? `Invite sent · ${action.payload.companyName.trim()}`
            : `Login created · ${action.payload.companyName.trim()}`,
        body: action.payload.ownerEmail.trim().toLowerCase(),
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
        body: `${user.email} · ${action.payload.tempPassword}`,
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
  setCompanyStatus,
  deleteCompany,
  grantAccess,
  markNotificationRead,
  markAllNotificationsRead,
  resetUserPassword,
  upsertTicket,
  setTicketStatus,
} = platformSlice.actions

export const platformReducer = platformSlice.reducer
