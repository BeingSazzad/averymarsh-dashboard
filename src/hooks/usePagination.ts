import { useMemo, useState } from 'react'

const DEFAULT_PAGE_SIZE = 10

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE, resetKey = '') {
  const [pageByKey, setPageByKey] = useState<Record<string, number>>({ [resetKey]: 1 })
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize) || 1)
  const page = Math.min(Math.max(1, pageByKey[resetKey] ?? 1), pageCount)

  const setPage = (next: number) => {
    setPageByKey((prev) => ({
      ...prev,
      [resetKey]: Math.min(Math.max(1, next), pageCount),
    }))
  }

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  const from = items.length === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, items.length)

  return {
    page,
    setPage,
    pageSize,
    pageCount,
    pageItems,
    total: items.length,
    from,
    to,
  }
}
