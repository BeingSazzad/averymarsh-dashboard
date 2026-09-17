import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { uid } from '../lib/utils'
import {
  seedAdmins,
  seedCompanies,
  seedFaqs,
  seedInvoices,
  seedLegal,
  seedPlans,
  seedUsers,
} from '../lib/seed'
import type {
  Admin,
  Company,
  FaqItem,
  Invoice,
  LegalDoc,
  Plan,
  SeatUser,
  SessionAdmin,
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
      state.legal = state.legal.map((doc) => (doc.id === action.payload.id ? action.payload : doc))
    },
    upsertAdmin(state, action: PayloadAction<Admin>) {
      const index = state.admins.findIndex((admin) => admin.id === action.payload.id)
      if (index >= 0) state.admins[index] = action.payload
      else state.admins.push(action.payload)
    },
    deleteAdmin(state, action: PayloadAction<string>) {
      state.admins = state.admins.filter((admin) => admin.id !== action.payload)
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
