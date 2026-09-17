import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyPoint } from '../../types/common.types'
import { compactMoney } from '../../lib/utils'

interface TrendChartProps {
  data: MonthlyPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1677FF" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#1677FF" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#DDE1E7" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#68707C', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#68707C', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #DDE1E7' }}
            formatter={(value, name) => {
              const n = Number(value)
              if (name === 'income') return [compactMoney(n), 'Income']
              if (name === 'users') return [n, 'Users']
              return [n, 'Subscriptions']
            }}
          />
          <Area type="monotone" dataKey="users" stroke="#0EA5E9" fill="none" strokeWidth={2} />
          <Area type="monotone" dataKey="subscriptions" stroke="#10A976" fill="none" strokeWidth={2} />
          <Area type="monotone" dataKey="income" stroke="#1677FF" fill="url(#incomeFill)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
