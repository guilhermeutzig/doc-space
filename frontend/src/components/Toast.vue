<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
})

const toastClasses = computed(() => ({
  toast: true,
  [`toast--${props.type}`]: true,
}))

if (props.duration > 0) {
  setTimeout(() => {
    props.onClose()
  }, props.duration)
}
</script>

<template>
  <div :class="toastClasses" role="alert">
    <div class="toast__content">
      <span class="toast__icon">
        <Icon v-if="type === 'success'" icon="mdi:check-circle" width="20" />
        <Icon v-if="type === 'error'" icon="mdi:close-circle" width="20" />
        <Icon v-if="type === 'info'" icon="mdi:information" width="20" />
      </span>
      <p class="toast__message">{{ message }}</p>
      <button class="toast__close" @click="onClose" aria-label="Close notification">
        <Icon icon="mdi:close" width="20" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast {
  min-width: 300px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.2s ease-out;
}

.toast__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast__icon {
  line-height: 0;
}

.toast__message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: inherit;
}

.toast__close {
  margin-left: auto;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 0;
}

.toast__close:hover {
  opacity: 1;
}

.toast--success {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.toast--error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.toast--info {
  background-color: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
