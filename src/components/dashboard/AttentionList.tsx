import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { companyLabel, companyTone } from '../../lib/status'
import { formatDate } from '../../lib/utils'
import { renewCompany } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Badge } from '../shared/Badge'
import { CompanyMark } from '../shared/CompanyMark'
import { Button } from '../ui/Button'

export function AttentionList() {
  const dispatch = useAppDispatch()
  const companies = useAppSelector((state) =>
    state.platform.companies.filter((company) => company.status === 'past_due' || company.status === 'trial')
  )

  return (
    <div className="panel p-5 h-full fade-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-[#FFF7E6] text-[#D97706] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#171A1F]">Needs action</h2>
            <p className="text-[11px] text-[#68707C]">Trials and past-due accounts</p>
          </div>
        </div>
        <Link to={ROUTES.companies} className="text-xs font-semibold text-[#1677FF] hover:underline">
          View all
        </Link>
      </div>

      {companies.length === 0 ? (
        <p className="text-sm text-[#68707C] py-6 text-center">Nothing needs you right now.</p>
      ) : (
        <ul className="flex flex-col">
          {companies.map((company) => (
            <li
              key={company.id}
              className="py-3.5 border-t border-[#EAEDF1] first:border-t-0 first:pt-0 last:pb-0 flex items-center gap-3"
            >
              <CompanyMark name={company.name} size={36} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#171A1F] truncate">{company.name}</p>
                <p className="text-xs text-[#68707C] mt-0.5">
                  {company.people} people · renews {formatDate(company.renewsOn)}
                </p>
              </div>
              <Badge tone={companyTone(company.status)}>{companyLabel(company.status)}</Badge>
              <Button size="sm" variant="secondary" onClick={() => dispatch(renewCompany(company.id))}>
                <RefreshCw className="w-3.5 h-3.5" />
                Renew
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
