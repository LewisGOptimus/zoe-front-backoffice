<template>
  <ModalShell :id="id" :modal-open="modalOpen" @close-modal="emit('close-modal')">
    <template #default="{ close }">
      <div class="p-6">
        <header class="mb-4 flex items-start justify-between gap-4">
          <h2 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {{ title }}
          </h2>
          <ModalCloseButton @click="close" />
        </header>
        <slot />
      </div>
    </template>
  </ModalShell>
</template>

<script setup lang="ts">
import ModalCloseButton from './ModalCloseButton.vue'
import ModalShell from './ModalShell.vue'

defineProps<{
  id: string
  modalOpen: boolean
  title?: string
}>()

const emit = defineEmits<{
  'close-modal': []
}>()
</script>
