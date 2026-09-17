import { useMemo, useState } from 'react'

const DEFAULT_PAGE_SIZE = 10

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE, resetKey = '') {
  const [cursor, setCursor] = useState({ key: resetKey, page: 1 })

  if (cursor.key !== resetKey) {
    setCursor({ key: resetKey, page: 1 })
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(Math.max(1, cursor.key === resetKey ? cursor.page : 1), pageCount)

  const setPage = (next: number) => {
    setCursor({ key: resetKey, page: Math.min(Math.max(1, next), pageCount) })
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
