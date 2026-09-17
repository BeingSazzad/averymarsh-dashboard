import { ChevronLeft, ChevronRight } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  from: number
  to: number
  onPageChange: (page: number) => void
}

function pageWindow(page: number, pageCount: number): (number | '…')[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1])
  const sorted = [...pages].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b)

  const result: (number | '…')[] = []
  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i]
    const prev = sorted[i - 1]
    if (prev !== undefined && current - prev > 1) result.push('…')
    result.push(current)
  }
  return result
}

export function Pagination({ page, pageCount, total, from, to, onPageChange }: PaginationProps) {
  if (total === 0) return null

  const numbers = pageWindow(page, pageCount)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-[#EAEDF1] bg-[#F8FAFC]/70">
      <p className="text-xs text-[#68707C]">
        Showing <span className="font-semibold text-[#171A1F]">{from}</span>–
        <span className="font-semibold text-[#171A1F]">{to}</span> of{' '}
        <span className="font-semibold text-[#171A1F]">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-[#68707C] hover:bg-white hover:text-[#171A1F] border border-transparent hover:border-[#DDE1E7] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {numbers.map((item, index) =>
          item === '…' ? (
            <span key={`ellipsis-${index}`} className="w-8 text-center text-xs text-[#94A3B8]">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={classNames(
                'h-8 min-w-8 px-2 rounded-lg text-xs font-semibold cursor-pointer border transition-colors',
                item === page
                  ? 'bg-[#1677FF] text-white border-[#1677FF]'
                  : 'bg-transparent text-[#68707C] border-transparent hover:bg-white hover:border-[#DDE1E7] hover:text-[#171A1F]'
              )}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-[#68707C] hover:bg-white hover:text-[#171A1F] border border-transparent hover:border-[#DDE1E7] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
