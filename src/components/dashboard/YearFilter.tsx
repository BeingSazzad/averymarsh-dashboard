import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setYear } from '../../store/platformSlice'
import { YEARS } from '../../lib/constants'
import { Select } from '../ui/Select'

export function YearFilter() {
  const year = useAppSelector((state) => state.platform.year)
  const dispatch = useAppDispatch()
  return (
    <div className="w-36">
      <Select
        label="Year"
        value={String(year)}
        onChange={(event) => dispatch(setYear(Number(event.target.value)))}
        options={YEARS.map((item) => ({ value: String(item), label: String(item) }))}
      />
    </div>
  )
}
