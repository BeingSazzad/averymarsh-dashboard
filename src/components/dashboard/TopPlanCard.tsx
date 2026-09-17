import type { PlanShare } from '../../lib/planShares'

interface TopPlanCardProps {
  shares: PlanShare[]
  total: number
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function donutSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, endAngle)
  const end = polar(cx, cy, r, startAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`
}

function buildArcs(shares: PlanShare[], cx: number, cy: number, radius: number) {
  const active = shares.filter((share) => share.count > 0)
  const gapDeg = active.length > 1 ? 3 : 0

  return active.reduce<{
    arcs: Array<PlanShare & { full: boolean; d: string }>
    angle: number
  }>(
    (acc, share) => {
      const rawSweep = (share.percent / 100) * 360
      const sweep = Math.max(rawSweep - gapDeg, 1.5)
      const start = acc.angle
      const end = start + sweep
      const nextAngle = acc.angle + rawSweep

      if (share.percent >= 99.9 && active.length === 1) {
        return {
          angle: nextAngle,
          arcs: [...acc.arcs, { ...share, full: true, d: '' }],
        }
      }

      return {
        angle: nextAngle,
        arcs: [
          ...acc.arcs,
          {
            ...share,
            full: false,
            d: donutSlice(cx, cy, radius, start, end),
          },
        ],
      }
    },
    { arcs: [], angle: 0 }
  ).arcs
}

export function TopPlanCard({ shares, total }: TopPlanCardProps) {
  const size = 196
  const stroke = 28
  const radius = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const arcs = buildArcs(shares, cx, cy, radius)

  return (
    <div className="panel p-5 md:p-6 fade-up h-full min-h-[480px] flex flex-col">
      <h2 className="text-lg font-bold text-[#171A1F] tracking-tight leading-none">Plans</h2>

      <div className="flex-1 flex flex-col items-center justify-between gap-6 pt-6 pb-1">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#EEF1F5" strokeWidth={stroke} />
            {arcs.map((arc) =>
              arc.full ? (
                <circle
                  key={arc.id}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={stroke}
                />
              ) : (
                <path
                  key={arc.id}
                  d={arc.d}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                />
              )
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[32px] font-bold text-[#171A1F] tabular-nums leading-none tracking-tight">
              {total}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8] mt-2">
              companies
            </p>
          </div>
        </div>

        <ul className="w-full flex flex-col gap-2.5">
          {shares.map((share) => (
            <li
              key={share.id}
              className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3 py-2.5"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: share.color }}
              />
              <span className="flex-1 text-sm font-semibold text-[#171A1F] truncate">{share.name}</span>
              <span className="text-sm font-bold tabular-nums text-[#171A1F]">{share.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
