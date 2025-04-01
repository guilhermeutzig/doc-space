<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ToastContainer.vue'
import { onMounted, ref } from 'vue'
import { useToast } from './composables/useToast'

const toastContainerRef = ref()
const { setContainer } = useToast()

onMounted(() => {
  setContainer(toastContainerRef.value)
})
</script>

<template>
  <RouterView />
  <ToastContainer ref="toastContainerRef" />
</template>
