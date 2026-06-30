export type ModalCloseEmit = (event: 'close-modal') => void

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type ModalPosition = 'center' | 'top'

export type UseModalOptions = {
  /** Se ejecuta cada vez que el modal se cierra (X, Esc, clic fuera o `close()`). */
  onClose?: () => void
}
