export type NotificationAlertType = 'success' | 'error' | 'warning' | 'info'

export type NotificationAlertItem = {
  id: number
  type: NotificationAlertType
  title: string
  message: string
  open: boolean
}
