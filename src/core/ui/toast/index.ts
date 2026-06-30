export { default as Toast2 } from './Toast2.vue'
export { default as ToastHost } from './ToastHost.vue'
export { useToastStore } from './toast.store'
export type { ToastItem, ToastType } from './toast.types'

import { useToastStore } from './toast.store'

export const useToast = () => {
  const toastStore = useToastStore()

  return {
    success: toastStore.showSuccess,
    error: toastStore.showError,
    warning: toastStore.showWarning,
    info: toastStore.showInfo,
    show: toastStore.show,
    remove: toastStore.remove,
  }
}
