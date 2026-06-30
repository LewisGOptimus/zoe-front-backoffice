import type { UTableRow } from '~/core/ui/Tables/utable.types'

export function filterTableRows<T extends UTableRow>(rows: T[], search: string): T[] {
  const term = search.trim().toLowerCase()
  if (!term) return rows

  return rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value ?? '').toLowerCase().includes(term),
    ),
  )
}
