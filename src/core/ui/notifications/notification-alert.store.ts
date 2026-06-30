import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { NotificationAlertItem, NotificationAlertType } from './notification-alert.types'

const DEFAULT_DURATION_MS = 6000

type PushNotificationPayload = {
  type: NotificationAlertType
  title: string
  message?: string
  duration?: number
}

export const useNotificationAlertStore = defineStore('notificationAlert', () => {
  const items = ref<NotificationAlertItem[]>([])
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

  const push = ({ type, title, message = '', duration }: PushNotificationPayload) => {
    const id = ++nextId

    items.value.push({
      id,
      type,
      title,
      message,
      open: true,
    })

    scheduleRemoval(id, duration)
    return id
  }

  const showSuccess = (title: string, message?: string) =>
    push({ type: 'success', title, message })

  const showError = (title: string, message?: string) =>
    push({ type: 'error', title, message })

  const showWarning = (title: string, message?: string) =>
    push({ type: 'warning', title, message })

  const showInfo = (title: string, message?: string) =>
    push({ type: 'info', title, message })

  return {
    items,
    push,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    remove,
  }
})
