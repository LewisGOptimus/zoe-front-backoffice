<template>
  <button
    type="button"
    class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:text-gray-500 dark:hover:bg-gray-700/60 dark:hover:text-gray-300"
    @click="emit('click', $event)"
  >
    <span class="sr-only">Cerrar</span>
    <svg class="size-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
