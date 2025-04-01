import { ref, markRaw } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface ToastContainer extends ComponentPublicInstance {
  addToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void
}

const toastContainer = ref<ToastContainer | null>(null)

export function useToast() {
  const setContainer = (container: ToastContainer) => {
    toastContainer.value = markRaw(container)
  }

  const show = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    if (toastContainer.value) {
      toastContainer.value.addToast(message, type, duration)
    } else {
      console.warn(
        'Toast container not found. Make sure to add ToastContainer component to your app.',
      )
    }
  }

  const success = (message: string, duration?: number) => show(message, 'success', duration)
  const error = (message: string, duration?: number) => show(message, 'error', duration)
  const info = (message: string, duration?: number) => show(message, 'info', duration)

  return {
    setContainer,
    show,
    success,
    error,
    info,
  }
}
