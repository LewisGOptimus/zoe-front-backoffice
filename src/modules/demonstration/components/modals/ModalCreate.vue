<template>
  <Teleport to="body">
    <ModalBasic
      id="create-demonstration-modal"
      :modal-open="modalOpen"
      title="Crear demostración"
      @close-modal="handleClose"
    >
    <div class="px-5 py-4">
      <FormDemonstration ref="formRef" @submit="handleCreate" />
    </div>

    <div class="px-5 py-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-end gap-2">
      <Button variant="secondary" :disabled="isSubmitting" @click="handleClose">
        Cancelar
      </Button>
      <Button variant="primary" :loading="isSubmitting" @click="submitForm">
        Crear
      </Button>
    </div>
    </ModalBasic>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '~/core/ui/buttons'
import { ModalBasic } from '~/core/ui/modal'
import { useDemonstrationsStore } from '../../store/demonstrations.store'
import type { Demonstration } from '../../types/demonstration.types'
import FormDemonstration from '../forms/forms.vue'

defineProps<{
  modalOpen: boolean
}>()

const emit = defineEmits<{
  'close-modal': []
  created: []
}>()

const demonstrationsStore = useDemonstrationsStore()
const formRef = ref<InstanceType<typeof FormDemonstration> | null>(null)
const isSubmitting = ref(false)

const handleClose = () => {
  if (isSubmitting.value) return
  formRef.value?.reset()
  emit('close-modal')
}

const submitForm = () => {
  formRef.value?.submit()
}

const handleCreate = async (demonstration: Demonstration) => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    await demonstrationsStore.createDemonstration(demonstration)
    await demonstrationsStore.getDemonstrations({
      amount: demonstrationsStore.amount,
      page: demonstrationsStore.page,
    })
    formRef.value?.reset()
    emit('created')
    emit('close-modal')
  } finally {
    isSubmitting.value = false
  }
}
</script>
