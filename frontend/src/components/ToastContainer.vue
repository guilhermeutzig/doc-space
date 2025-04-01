<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Toast from './Toast.vue'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const toasts = ref<ToastItem[]>([])
let toastId = 0

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

defineExpose({
  addToast: (message: string, type: 'success' | 'error' | 'info', duration = 6000) => {
    const id = toastId++
    toasts.value.push({ id, message, type, duration })
  },
})
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <Toast
        v-for="(toast, index) in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        :style="{
          bottom: `${index * 70 + 20}px`,
        }"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
