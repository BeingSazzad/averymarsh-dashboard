import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyPoint } from '../../types/common.types'
import { compactMoney } from '../../lib/utils'
import { YearFilter } from './YearFilter'

interface TrendChartProps {
  data: MonthlyPoint[]
  year: number
}

export function TrendChart({ data, year }: TrendChartProps) {
  return (
    <div className="panel p-5 md:p-6 fade-up h-full min-h-[480px] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
        <h2 className="text-lg font-bold text-[#171A1F] tracking-tight leading-none">{year} overview</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-5 text-xs font-semibold">
            <span className="flex items-center gap-2 text-[#1677FF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] shadow-[0_0_0_3px_rgba(22,119,255,0.15)]" />
              Revenue
            </span>
            <span className="flex items-center gap-2 text-[#171A1F]">
              <span className="w-4 h-0.5 rounded-full bg-[#171A1F]" />
              Subscriber
            </span>
          </div>
          <YearFilter />
        </div>
      </div>

      <div className="flex-1 min-h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1677FF" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#1677FF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EAEDF1" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              yAxisId="money"
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(value) => compactMoney(Number(value))}
            />
            <YAxis
              yAxisId="subscriber"
              orientation="right"
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ stroke: '#DDE1E7', strokeDasharray: '4 4' }}
              contentStyle={{
                borderRadius: 14,
                border: '1px solid #DDE1E7',
                boxShadow: '0 12px 30px rgba(23,26,31,0.08)',
                padding: '10px 12px',
              }}
              labelStyle={{ color: '#68707C', fontWeight: 700, marginBottom: 4 }}
              formatter={(value, name) => {
                const n = Number(value)
                if (name === 'income') return [compactMoney(n), 'Revenue']
                return [n, 'Subscriber']
              }}
            />
            <Area
              yAxisId="money"
              type="monotone"
              dataKey="income"
              stroke="#1677FF"
              fill="url(#incomeFill)"
              strokeWidth={2.75}
              isAnimationActive={false}
            />
            <Line
              yAxisId="subscriber"
              type="monotone"
              dataKey="subscriptions"
              stroke="#171A1F"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
