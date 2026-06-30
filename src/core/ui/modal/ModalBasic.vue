<template>
  <ModalShell :id="id" :modal-open="modalOpen" :size="size" @close-modal="emit('close-modal')">
  <template #default="{ close }">
    <header
      v-if="title || description"
      class="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-linear-to-b from-gray-50/90 to-white px-6 py-4 dark:border-gray-700/60 dark:from-gray-900/50 dark:to-gray-800"
    >
      <div class="min-w-0 pr-2">
        <h2 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {{ title }}
        </h2>
        <p v-if="description" class="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <ModalCloseButton @click="close" />
    </header>

    <div class="flex-1 overflow-y-auto">
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
  title?: string
  description?: string
  size?: ModalSize
}>(), {
  size: 'lg',
})

const emit = defineEmits<{
  'close-modal': []
}>()
</script>
