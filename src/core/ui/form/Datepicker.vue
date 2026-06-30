<template>
  <InputField
    :label="label"
    :html-for="pickerId"
    :required="required"
  >
    <div class="relative">
      <flat-pickr
        :id="pickerId"
        v-model="date"
        class="form-input pl-9 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium"
        :class="fullWidth ? 'w-full' : 'w-[15.5rem]'"
        :config="config"
      />
      <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
        <svg class="fill-current text-gray-400 dark:text-gray-500 ml-3" width="16" height="16" viewBox="0 0 16 16">
          <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
          <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
        </svg>
      </div>
    </div>
  </InputField>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import type flatpickr from 'flatpickr'

import InputField from '~/core/ui/inputs/InputField.vue'

const props = withDefaults(defineProps<{
  modelValue?: string | Date | Date[] | null
  id?: string
  label?: string
  required?: boolean
  align?: string
  mode?: 'single' | 'range'
  dateFormat?: string
  fullWidth?: boolean
}>(), {
  modelValue: null,
  required: false,
  mode: 'range',
  dateFormat: '',
  fullWidth: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | Date | Date[] | null]
}>()

const generatedId = useId()
const pickerId = computed(() => props.id ?? generatedId)

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const config = computed(() => {
  const isRange = props.mode === 'range'
  const format = props.dateFormat || (isRange ? 'M j, Y' : 'd/m/Y')

  return {
    mode: props.mode,
    appendTo: import.meta.client ? document.body : undefined,
    monthSelectorType: 'static' as const,
    dateFormat: format,
    ...(isRange
      ? { defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()] }
      : {}),
    prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (_selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => {
      if (isRange) {
        (instance.element as HTMLInputElement).value = dateStr.replace('to', '-')
      }
      const customClass = props.align ?? ''
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`)
      instance.calendarContainer.classList.add('flatpickr-overlay')
    },
    onChange: (_selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => {
      if (isRange) {
        const input = instance.element as HTMLInputElement
        input.value = dateStr.replace('to', '-')
        emit('update:modelValue', input.value)
        return
      }
      emit('update:modelValue', dateStr)
    },
  }
})
</script>
