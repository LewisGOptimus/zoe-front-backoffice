import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ToastItem, ToastType } from './toast.types'

const DEFAULT_DURATION_MS = 5000

type ShowToastPayload = {
  type: ToastType
  message: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([])
  let nextId = 0
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  const remove = (id: number) => {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }

    const index = items.value.findIndex((item) => item.id === id)
    if (index === -1) return

    items.value[index].open = false

    setTimeout(() => {
      items.value = items.value.filter((item) => item.id !== id)
    }, 200)
  }

  const scheduleRemoval = (id: number, duration = DEFAULT_DURATION_MS) => {
    const timer = setTimeout(() => remove(id), duration)
    timers.set(id, timer)
  }

  const show = ({ type, message, duration }: ShowToastPayload) => {
    const id = ++nextId

    items.value.push({
      id,
      type,
      message,
      open: true,
    })

    scheduleRemoval(id, duration)
    return id
  }

  const showSuccess = (message: string, duration?: number) =>
    show({ type: 'success', message, duration })

  const showError = (message: string, duration?: number) =>
    show({ type: 'error', message, duration })

  const showWarning = (message: string, duration?: number) =>
    show({ type: 'warning', message, duration })

  const showInfo = (message: string, duration?: number) =>
    show({ type: 'info', message, duration })

  return {
    items,
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    remove,
  }
})
