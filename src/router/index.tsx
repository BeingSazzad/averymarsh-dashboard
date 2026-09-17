import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { PrivateRoute } from './PrivateRoute'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { AnalyticsPage } from '../pages/dashboard/AnalyticsPage'
import { CompaniesPage } from '../pages/companies/CompaniesPage'
import { UsersPage } from '../pages/users/UsersPage'
import { PlansPage } from '../pages/plans/PlansPage'
import { BillingPage } from '../pages/billing/BillingPage'
import { CmsPage } from '../pages/cms/CmsPage'
import { AdminsPage } from '../pages/admins/AdminsPage'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <PrivateRoute />,
    children: [
      { path: ROUTES.overview, element: <DashboardPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: ROUTES.companies, element: <CompaniesPage /> },
      { path: ROUTES.users, element: <UsersPage /> },
      { path: ROUTES.plans, element: <PlansPage /> },
      { path: ROUTES.billing, element: <BillingPage /> },
      { path: ROUTES.cms, element: <CmsPage /> },
      { path: ROUTES.admins, element: <AdminsPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
