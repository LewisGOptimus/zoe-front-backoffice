<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      type="button"
      class="btn px-2.5 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-400 dark:text-gray-500"
      aria-haspopup="true"
      aria-label="Columnas"
      :aria-expanded="dropdownOpen"
      @click.prevent="dropdownOpen = !dropdownOpen"
    >
      <span class="sr-only">Columnas</span><wbr />
      <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16">
        <path d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM7 12a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Z" />
      </svg>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="dropdownOpen"
        class="origin-top-right z-10 absolute top-full left-0 right-auto min-w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 pt-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'md:left-auto md:right-0' : 'md:left-0 md:right-auto'"
      >
        <div ref="dropdown">
          <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
            Columnas
          </div>

          <ul class="mb-4 max-h-64 overflow-y-auto">
            <li
              v-for="column in toggleableColumns"
              :key="column.key"
              class="py-1 px-3"
            >
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="form-checkbox"
                  :checked="isVisible(column.key)"
                  :disabled="!canUncheck(column.key)"
                  @change="onToggle(column.key, ($event.target as HTMLInputElement).checked)"
                >
                <span class="text-sm font-medium ml-2">{{ column.label }}</span>
              </label>
            </li>
          </ul>

          <div class="py-2 px-3 border-t border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-700/20">
            <ul class="flex items-center justify-between">
              <li>
                <button
                  type="button"
                  class="btn-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500"
                  @click="handleReset"
                >
                  Restablecer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="btn-xs bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300"
                  @click="dropdownOpen = false"
                >
                  Aplicar
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import type { UTableColumn } from '~/core/ui/Tables/utable.types'

const props = withDefaults(defineProps<{
  columns: UTableColumn[]
  align?: 'left' | 'right'
  minVisible?: number
}>(), {
  align: 'right',
  minVisible: 1,
})

const visibleKeys = defineModel<string[]>({ required: true })

const emit = defineEmits<{
  reset: []
}>()

const dropdownOpen = ref(false)
const trigger = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)

const toggleableColumns = computed(() =>
  props.columns.filter((column) => column.toggleable !== false),
)

const isVisible = (key: string) => visibleKeys.value.includes(key)

const canUncheck = (key: string) => {
  if (!isVisible(key)) return true

  const toggleableVisibleCount = visibleKeys.value.filter((visibleKey) =>
    toggleableColumns.value.some((column) => column.key === visibleKey),
  ).length

  return toggleableVisibleCount > props.minVisible
}

const onToggle = (key: string, checked: boolean) => {
  if (checked) {
    if (!visibleKeys.value.includes(key)) {
      visibleKeys.value = [...visibleKeys.value, key]
    }
    return
  }

  if (!canUncheck(key)) return

  visibleKeys.value = visibleKeys.value.filter((visibleKey) => visibleKey !== key)
}

const handleReset = () => {
  visibleKeys.value = props.columns.map((column) => column.key)
  emit('reset')
}

const clickHandler = ({ target }: MouseEvent) => {
  if (!dropdownOpen.value || !target || !(target instanceof Node)) return
  if (dropdown.value?.contains(target) || trigger.value?.contains(target)) return
  dropdownOpen.value = false
}

const keyHandler = ({ keyCode }: KeyboardEvent) => {
  if (!dropdownOpen.value || keyCode !== 27) return
  dropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', clickHandler)
  document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  document.removeEventListener('keydown', keyHandler)
})
</script>
