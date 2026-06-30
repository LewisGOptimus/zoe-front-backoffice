export { default as Notification } from './Notification.vue'
export { default as NotificationsAlert } from './NotificationsAlert.vue'
export { useNotificationAlertStore } from './notification-alert.store'
export type { NotificationAlertItem, NotificationAlertType } from './notification-alert.types'

import { useNotificationAlertStore } from './notification-alert.store'

export const useNotificationAlert = () => {
  const store = useNotificationAlertStore()

  return {
    success: store.showSuccess,
    error: store.showError,
    warning: store.showWarning,
    info: store.showInfo,
    push: store.push,
    remove: store.remove,
  }
}
