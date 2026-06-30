import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

import type { UTableColumn } from '~/core/ui/Tables/utable.types'

type UseVisibleTableColumnsOptions = {
  storageKey?: string
  minVisible?: number
}

const readStoredKeys = (storageKey: string, validKeys: string[]): string[] | null => {
  if (!import.meta.client) return null

  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return null

    const parsed = JSON.parse(stored) as string[]
    const filtered = parsed.filter((key) => validKeys.includes(key))
    return filtered.length > 0 ? filtered : null
  } catch {
    return null
  }
}

const writeStoredKeys = (storageKey: string, keys: string[]) => {
  if (!import.meta.client) return
  localStorage.setItem(storageKey, JSON.stringify(keys))
}

export const useVisibleTableColumns = (
  allColumns: MaybeRefOrGetter<UTableColumn[]>,
  options: UseVisibleTableColumnsOptions = {},
) => {
  const minVisible = options.minVisible ?? 1

  const columnKeys = computed(() =>
    toValue(allColumns)
      .filter((column) => column.toggleable !== false)
      .map((column) => column.key),
  )

  const allColumnKeys = computed(() => toValue(allColumns).map((column) => column.key))

  const lockedColumnKeys = computed(() =>
    toValue(allColumns)
      .filter((column) => column.toggleable === false)
      .map((column) => column.key),
  )

  const createDefaultKeys = () => [...allColumnKeys.value]

  const normalizeVisibleKeys = (keys: string[]) => {
    const valid = keys.filter((key) => allColumnKeys.value.includes(key))
    const merged = [...new Set([...lockedColumnKeys.value, ...valid])]
    return merged.length > 0 ? merged : createDefaultKeys()
  }

  const visibleKeys = ref<string[]>(normalizeVisibleKeys(createDefaultKeys()))

  const syncFromStorage = () => {
    const defaults = createDefaultKeys()
    const stored = options.storageKey
      ? readStoredKeys(options.storageKey, allColumnKeys.value)
      : null

    visibleKeys.value = normalizeVisibleKeys(stored ?? defaults)
  }

  syncFromStorage()

  watch(allColumnKeys, () => {
    visibleKeys.value = normalizeVisibleKeys(visibleKeys.value)
  })

  watch(
    visibleKeys,
    (keys) => {
      const normalized = normalizeVisibleKeys(keys)
      if (normalized.join('|') !== keys.join('|')) {
        visibleKeys.value = normalized
        return
      }

      if (options.storageKey) {
        writeStoredKeys(options.storageKey, normalized)
      }
    },
    { deep: true },
  )

  const visibleColumns = computed(() => {
    const keys = new Set(visibleKeys.value)
    return toValue(allColumns).filter((column) => keys.has(column.key))
  })

  const resetVisibleColumns = () => {
    visibleKeys.value = createDefaultKeys()
  }

  const canToggleOff = (key: string) => {
    if (lockedColumnKeys.value.includes(key)) return false
    if (!columnKeys.value.includes(key)) return false
    if (!visibleKeys.value.includes(key)) return true

    const toggleableVisibleCount = visibleKeys.value.filter((visibleKey) =>
      columnKeys.value.includes(visibleKey),
    ).length

    return toggleableVisibleCount > minVisible
  }

  const setColumnVisible = (key: string, visible: boolean) => {
    if (!columnKeys.value.includes(key)) return

    if (visible) {
      if (!visibleKeys.value.includes(key)) {
        visibleKeys.value = [...visibleKeys.value, key]
      }
      return
    }

    if (!canToggleOff(key)) return

    visibleKeys.value = visibleKeys.value.filter((visibleKey) => visibleKey !== key)
  }

  const toggleColumn = (key: string) => {
    setColumnVisible(key, !visibleKeys.value.includes(key))
  }

  return {
    visibleKeys,
    visibleColumns,
    columnKeys,
    resetVisibleColumns,
    canToggleOff,
    setColumnVisible,
    toggleColumn,
  }
}
