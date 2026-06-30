<template>
  <div class="bg-white dark:bg-gray-800 shadow-xs rounded-xl overflow-hidden relative">
    <header v-if="title" class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">
        {{ title }}
        <span v-if="count !== undefined" class="text-gray-400 dark:text-gray-500 font-medium">{{ count }}</span>
      </h2>
    </header>

    <div class="overflow-x-auto">
        <table class="table-auto w-full text-gray-600 dark:text-gray-300">
          <thead class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
            <tr>
              <th v-if="selectable" class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px text-center">
                <div class="flex items-center justify-center">
                  <label class="inline-flex">
                    <span class="sr-only">Seleccionar todo</span>
                    <input v-model="selectAll" class="form-checkbox" type="checkbox" @click="toggleSelectAll">
                  </label>
                </div>
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-left"
              >
                <slot :name="`header-${column.key}`" :column="column">
                  <div class="font-semibold text-left">
                    {{ column.label }}
                  </div>
                </slot>
              </th>
              <th v-if="showActions" class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-left">
                <slot name="header-actions">
                  <div v-if="actionsLabel" class="font-semibold text-left">{{ actionsLabel }}</div>
                  <span v-else class="sr-only">Menú</span>
                </slot>
              </th>
            </tr>
          </thead>

          <tbody class="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            <tr v-for="row in rows" :key="getRowKey(row)">
              <td v-if="selectable" class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px text-center">
                <div class="flex items-center justify-center">
                  <label class="inline-flex">
                    <span class="sr-only">Seleccionar</span>
                    <input
                      class="form-checkbox"
                      type="checkbox"
                      :value="getRowKey(row)"
                      :checked="isRowSelected(row)"
                      @change="toggleRow(row)"
                    >
                  </label>
                </div>
              </td>

              <td
                v-for="column in columns"
                :key="column.key"
                class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap text-left"
              >
                <slot :name="`cell-${column.key}`" :row="row" :column="column" :value="row[column.key]">
                  <!-- image-label -->
                  <div
                    v-if="column.type === 'image-label'"
                    class="flex items-center justify-start"
                  >
                    <div class="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                      <img
                        v-if="getCellImage(row, column)"
                        class="rounded-full"
                        :src="getCellImage(row, column)"
                        width="40"
                        height="40"
                        :alt="formatCellValue(row[column.key])"
                      >
                    </div>
                    <div class="font-medium text-gray-800 dark:text-gray-100">
                      {{ formatCellValue(row[column.key]) }}
                    </div>
                  </div>

                  <!-- badge -->
                  <div
                    v-else-if="column.type === 'badge'"
                    class="inline-flex font-medium rounded-full text-left px-2.5 py-0.5"
                    :class="resolveCellClass(row, column)"
                  >
                    {{ formatCellValue(row[column.key]) }}
                  </div>

                  <!-- icon-label -->
                  <div
                    v-else-if="column.type === 'icon-label'"
                    class="flex items-center justify-start"
                  >
                    <svg
                      class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-2"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <path
                        v-for="(path, index) in getIconPaths(row, column)"
                        :key="index"
                        :d="path"
                      />
                    </svg>
                    <div>{{ formatCellValue(row[column.key]) }}</div>
                  </div>

                  <!-- text (default) -->
                  <div
                    v-else
                    :class="[
                      'text-left',
                      cellTextClass(row, column),
                    ]"
                  >
                    {{ formatCellValue(row[column.key]) }}
                  </div>
                </slot>
              </td>

              <td v-if="showActions" class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px text-left">
                <slot name="actions" :row="row">
                  <!-- inline: botones por fila -->
                  <div v-if="actionsMode === 'inline'" class="flex justify-start space-x-1">
                    <button
                      v-for="action in actionButtons"
                      :key="action.key"
                      type="button"
                      class="rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      @click.stop="emitAction(action.key, row)"
                    >
                      <span class="sr-only">{{ action.label }}</span>
                      <svg class="w-8 h-8 fill-current" viewBox="0 0 32 32">
                        <path
                          v-for="(path, index) in getActionIconPaths(action)"
                          :key="index"
                          :d="path"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- menu: ⋯ -->
                  <button
                    v-else
                    type="button"
                    class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full"
                  >
                    <span class="sr-only">Menú</span>
                    <svg class="w-8 h-8 fill-current" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="2" />
                      <circle cx="10" cy="16" r="2" />
                      <circle cx="22" cy="16" r="2" />
                    </svg>
                  </button>
                </slot>
              </td>
            </tr>

            <tr v-if="rows.length === 0">
              <td :colspan="columnCount" class="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                {{ emptyText }}
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'

import { toTitleCase } from '~/shared/utils/format'
import {
  UTABLE_BADGE_FALLBACK_CLASS,
  UTABLE_TEXT_MAP_FALLBACK_CLASS,
} from './utable.types'
import type {
  UTableActionButton,
  UTableColumn,
  UTableRow,
} from './utable.types'

/** Iconos built-in opcionales para acciones inline comunes (edit, download, delete). */
const BUILTIN_INLINE_ACTION_ICONS: Record<string, string[]> = {
  edit: [
    'M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z',
  ],
  download: [
    'M16 20c.3 0 .5-.1.7-.3l5.7-5.7-1.4-1.4-4 4V8h-2v8.6l-4-4L9.6 14l5.7 5.7c.2.2.4.3.7.3zM9 22h14v2H9z',
  ],
  delete: [
    'M13 15h2v6h-2zM17 15h2v6h-2z',
    'M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z',
  ],
}

export default {
  name: 'UTable',
  props: {
    title: {
      type: String,
      default: '',
    },
    count: {
      type: [String, Number],
      default: undefined,
    },
    columns: {
      type: Array as () => UTableColumn[],
      required: true,
    },
    rows: {
      type: Array as () => UTableRow[],
      default: () => [],
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    /** `menu` = ⋯. `inline` = botones múltiples por fila. */
    actionsMode: {
      type: String as () => 'menu' | 'inline',
      default: 'menu',
    },
    /** Texto visible en el header de la columna de acciones (opcional). */
    actionsLabel: {
      type: String,
      default: '',
    },
    /** Botones cuando `actionsMode="inline"`. */
    actionButtons: {
      type: Array as () => UTableActionButton[],
      default: () => [],
    },
    emptyText: {
      type: String,
      default: 'No hay registros',
    },
  },
  emits: ['change-selection', 'action'],
  setup(props, { emit }) {
    const selectAll = ref(false)
    const selected = ref<Array<string | number>>([])

    const columnCount = computed(() => {
      let count = props.columns.length
      if (props.selectable) count += 1
      if (props.showActions) count += 1
      return count
    })

    const getRowKey = (row: UTableRow) => {
      const key = row[props.rowKey]
      return (key ?? row.id) as string | number
    }

    const isRowSelected = (row: UTableRow) => selected.value.includes(getRowKey(row))

    const toggleRow = (row: UTableRow) => {
      const key = getRowKey(row)
      const index = selected.value.indexOf(key)
      if (index === -1) selected.value.push(key)
      else selected.value.splice(index, 1)
    }

    const toggleSelectAll = () => {
      selected.value = []
      if (!selectAll.value) {
        selected.value = props.rows.map(getRowKey)
      }
    }

    watch(selected, () => {
      selectAll.value = props.rows.length > 0 && selected.value.length === props.rows.length
      emit('change-selection', [...selected.value])
    }, { deep: true })

    watch(() => props.rows, () => {
      selected.value = []
      selectAll.value = false
    })

    const formatCellValue = (value: unknown) => {
      if (typeof value !== 'string') return String(value ?? '')
      if (value === '-') return value
      return toTitleCase(value)
    }

    const cellVariantClass = (variant?: UTableColumn['variant']) => {
      if (variant === 'link') return 'font-medium text-sky-600'
      if (variant === 'success') return 'font-medium text-green-600'
      if (variant === 'warning') return 'font-medium text-amber-600'
      if (variant === 'danger') return 'font-medium text-red-600'
      if (variant === 'emphasis') return 'font-medium text-gray-800 dark:text-gray-100'
      return ''
    }

    const resolveVariant = (row: UTableRow, column: UTableColumn) => {
      if (column.variantKey) {
        return row[column.variantKey] as UTableColumn['variant']
      }
      return column.variant
    }

    const resolveMapKey = (row: UTableRow, column: UTableColumn) => {
      const refKey = column.classMapKey ?? column.key
      return row[refKey]
    }

    const resolveCellClass = (row: UTableRow, column: UTableColumn) => {
      const mapKey = resolveMapKey(row, column)
      const key = String(mapKey ?? row[column.key] ?? '')
      const fallback = column.classMapFallback
        ?? (column.type === 'badge' ? UTABLE_BADGE_FALLBACK_CLASS : '')

      return column.classMap?.[key] ?? fallback
    }

    const cellTextClass = (row: UTableRow, column: UTableColumn) => {
      if (column.classMap) {
        const mapKey = resolveMapKey(row, column)
        const key = String(mapKey ?? '')
        const mapped = column.classMap[key]
        if (mapped) return `font-medium ${mapped}`
        if (column.classMapKey) {
          return `font-medium ${column.classMapFallback ?? UTABLE_TEXT_MAP_FALLBACK_CLASS}`
        }
      }
      return cellVariantClass(resolveVariant(row, column))
    }

    const getCellImage = (row: UTableRow, column: UTableColumn) => {
      if (!column.imageKey) return ''
      return String(row[column.imageKey] ?? '')
    }

    const getIconPaths = (row: UTableRow, column: UTableColumn) => {
      const value = String(row[column.key] ?? '')
      return column.iconMap?.[value] ?? column.iconMap?.default ?? []
    }

    const getActionIconPaths = (action: UTableActionButton) => {
      if (action.iconPaths?.length) return action.iconPaths
      return BUILTIN_INLINE_ACTION_ICONS[action.key] ?? []
    }

    const emitAction = (actionKey: string, row: UTableRow) => {
      emit('action', { action: actionKey, row })
    }

    return {
      selectAll,
      selected,
      columnCount,
      getRowKey,
      isRowSelected,
      toggleRow,
      toggleSelectAll,
      formatCellValue,
      resolveCellClass,
      cellTextClass,
      getCellImage,
      getIconPaths,
      getActionIconPaths,
      emitAction,
    }
  },
}
</script>
