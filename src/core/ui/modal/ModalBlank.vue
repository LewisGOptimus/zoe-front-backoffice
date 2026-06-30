<template>
  <ModalShell :id="id" :modal-open="modalOpen" :size="size" :position="position" @close-modal="emit('close-modal')">
    <slot />
  </ModalShell>
</template>

<script setup lang="ts">
import ModalShell from './ModalShell.vue'
import type { ModalPosition, ModalSize } from './modal.types'

withDefaults(defineProps<{
  id: string
  modalOpen: boolean
  size?: ModalSize
  position?: ModalPosition
}>(), {
  size: 'lg',
  position: 'center',
})

const emit = defineEmits<{
  'close-modal': []
}>()
</script>
