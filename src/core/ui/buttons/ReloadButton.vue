<template>
  <Button
    variant="secondary"
    icon-only
    :loading="loading"
    :disabled="disabled"
    aria-label="Recargar"
    @click="emit('click', $event)"
  >
    <template #icon>
      <UIcon name="i-lucide-refresh-cw" class="size-4" />
    </template>
  </Button>
</template>

<script setup lang="ts">
import Button from './Button.vue'

withDefaults(defineProps<{
  loading?: boolean
  disabled?: boolean
}>(), {
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
