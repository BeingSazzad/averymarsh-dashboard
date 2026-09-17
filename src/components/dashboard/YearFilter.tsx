import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setYear } from '../../store/platformSlice'
import { YEARS } from '../../lib/constants'
import { CalendarDays, ChevronDown } from 'lucide-react'

export function YearFilter() {
  const year = useAppSelector((state) => state.platform.year)
  const dispatch = useAppDispatch()
  return (
    <label className="inline-flex items-center h-11 rounded-2xl border border-[#DDE1E7] bg-white overflow-hidden">
      <span className="px-3 h-full flex items-center gap-1.5 text-xs font-bold text-[#68707C] border-r border-[#EAEDF1] bg-[#F8FAFC]">
        <CalendarDays className="w-3.5 h-3.5" />
        Year
      </span>
      <span className="relative inline-flex items-center">
        <select
          value={String(year)}
          onChange={(event) => dispatch(setYear(Number(event.target.value)))}
          className="h-11 appearance-none pl-3 pr-9 text-sm font-bold text-[#171A1F] bg-transparent outline-none cursor-pointer"
        >
          {YEARS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 w-4 h-4 text-[#68707C]" />
      </span>
    </label>
  )
}
