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

interface TrendChartProps {
  data: MonthlyPoint[]
  year: number
}

export function TrendChart({ data, year }: TrendChartProps) {
  return (
    <div className="panel p-5 md:p-6 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">Platform pulse</p>
          <h2 className="text-lg font-bold text-[#171A1F] mt-1 tracking-tight">{year} overview</h2>
          <p className="text-sm text-[#68707C] mt-1">
            One view of app income and people growing on Lattice.
          </p>
        </div>
        <div className="flex items-center gap-5 text-xs font-semibold">
          <span className="flex items-center gap-2 text-[#1677FF]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] shadow-[0_0_0_3px_rgba(22,119,255,0.15)]" />
            Income
          </span>
          <span className="flex items-center gap-2 text-[#171A1F]">
            <span className="w-4 h-0.5 rounded-full bg-[#171A1F]" />
            People
          </span>
        </div>
      </div>

      <div className="h-[320px] w-full">
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
              yAxisId="people"
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
                if (name === 'income') return [compactMoney(n), 'Income']
                return [n, 'People']
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
              yAxisId="people"
              type="monotone"
              dataKey="users"
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
