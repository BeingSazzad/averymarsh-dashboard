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

function MiniChart({
  data,
  dataKey,
  color,
  label,
  format,
}: {
  data: MonthlyPoint[]
  dataKey: keyof MonthlyPoint
  color: string
  label: string
  format: (value: number) => string
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#DDE1E7] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#68707C] mb-2">{label}</p>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#DDE1E7" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#68707C', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#68707C', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(value) => format(Number(value))}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #DDE1E7' }}
              formatter={(value) => [format(Number(value)), label]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={`url(#fill-${dataKey})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
      <MiniChart data={data} dataKey="users" color="#171A1F" label="Users" format={(n) => String(n)} />
      <MiniChart
        data={data}
        dataKey="subscriptions"
        color="#68707C"
        label="Subscriptions"
        format={(n) => String(n)}
      />
      <MiniChart data={data} dataKey="income" color="#1677FF" label="Income" format={compactMoney} />
    </div>
  )
}
