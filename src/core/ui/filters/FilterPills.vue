<template>
  <div :class="wrapperClass">
    <ul
      class="flex flex-wrap -m-1"
      role="listbox"
      :aria-label="ariaLabel"
    >
      <li
        v-for="option in options"
        :key="option.key"
        class="m-1"
        role="presentation"
      >
        <button
          type="button"
          role="option"
          :aria-selected="isSelected(option.key)"
          class="inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border shadow-xs transition"
          :class="isSelected(option.key) ? activeClass : inactiveClass"
          @click="selectOption(option.key)"
        >
          {{ option.label }}
          <span
            v-if="showCount && option.count != null"
            class="ml-1 text-gray-400 dark:text-gray-500"
            :class="isSelected(option.key) ? 'text-white dark:text-gray-600' : ''"
          >
            {{ option.count }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { FilterPillOption } from './filter-pills.types'

const props = withDefaults(defineProps<{
  options: FilterPillOption[]
  ariaLabel?: string
  showCount?: boolean
  wrapperClass?: string
  activeClass?: string
  inactiveClass?: string
}>(), {
  ariaLabel: 'Filtros',
  showCount: true,
  wrapperClass: 'mb-4 sm:mb-0',
  activeClass: 'border-transparent bg-[#007BFF] dark:bg-gray-100 text-white dark:text-gray-800',
  inactiveClass: 'border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400',
})

const emit = defineEmits<{
  change: [key: string]
}>()

const model = defineModel<string>({ required: true })

const isSelected = (key: string) => model.value === key

const selectOption = (key: string) => {
  if (model.value === key) return
  model.value = key
  emit('change', key)
}
</script>
