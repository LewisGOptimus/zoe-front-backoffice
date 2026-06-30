<template>
  <ModalShell :id="id" :modal-open="modalOpen" :size="size" @close-modal="emit('close-modal')">
    <template #default="{ close }">
      <div class="relative px-6 py-7 sm:px-8 sm:py-8">
        <ModalCloseButton class="absolute right-4 top-4 sm:right-5 sm:top-5" @click="close" />
        <slot />
      </div>
    </template>
  </ModalShell>
</template>

<script setup lang="ts">
import ModalCloseButton from './ModalCloseButton.vue'
import ModalShell from './ModalShell.vue'
import type { ModalSize } from './modal.types'

withDefaults(defineProps<{
  id: string
  modalOpen: boolean
  size?: ModalSize
}>(), {
  size: 'md',
})

const emit = defineEmits<{
  'close-modal': []
}>()
</script>
