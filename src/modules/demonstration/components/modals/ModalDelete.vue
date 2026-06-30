<template>
  <Teleport to="body">
    <ModalAction
      id="delete-demonstration-modal"
      :modal-open="modalOpen"
      @close-modal="handleClose"
    >
      <div class="text-center">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-100 dark:bg-red-500/20"
        >
          <svg
            class="w-6 h-6 fill-current text-red-500"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z" />
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          ¿Eliminar demostración?
        </h3>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <template v-if="demonstrationName">
            Se eliminará la demostración de <span class="font-medium text-gray-700 dark:text-gray-200">{{ demonstrationName }}</span>.
          </template>
          <template v-else>
            Esta acción no se puede deshacer.
          </template>
        </p>

        <div class="flex justify-center gap-2">
          <Button variant="secondary" :disabled="isDeleting" @click="handleClose">
            Cancelar
          </Button>
          <Button variant="danger" :loading="isDeleting" @click="handleConfirm">
            Eliminar
          </Button>
        </div>
      </div>
    </ModalAction>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '~/core/ui/buttons'
import { ModalAction } from '~/core/ui/modal'
import { useDemonstrationsStore } from '../../store/demonstrations.store'

const props = defineProps<{
  modalOpen: boolean
  demonstrationId: string | null
  demonstrationName?: string
}>()

const emit = defineEmits<{
  'close-modal': []
  deleted: []
}>()

const demonstrationsStore = useDemonstrationsStore()
const isDeleting = ref(false)

const handleClose = () => {
  if (isDeleting.value) return
  emit('close-modal')
}

const handleConfirm = async () => {
  if (isDeleting.value || !props.demonstrationId) return

  isDeleting.value = true

  try {
    await demonstrationsStore.deleteDemonstration(props.demonstrationId)

    const isLastItemOnPage = demonstrationsStore.demonstrations.length === 1
    const shouldGoToPreviousPage = isLastItemOnPage && demonstrationsStore.page > 1
    const nextPage = shouldGoToPreviousPage
      ? demonstrationsStore.page - 1
      : demonstrationsStore.page

    await demonstrationsStore.getDemonstrations({
      amount: demonstrationsStore.amount,
      page: nextPage,
    })

    emit('deleted')
    emit('close-modal')
  } finally {
    isDeleting.value = false
  }
}
</script>
