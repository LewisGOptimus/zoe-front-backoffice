<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-for="toast in toastStore.items"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <Toast2
            :type="toast.type"
            :open="toast.open"
            @update:open="(value) => !value && toastStore.remove(toast.id)"
          >
            {{ toast.message }}
          </Toast2>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Toast2 from './Toast2.vue'
import { useToastStore } from './toast.store'

const toastStore = useToastStore()
</script>
