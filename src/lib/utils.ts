export function money(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function compactMoney(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${Math.round(value / 1000)}K`
  return money(value)
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
