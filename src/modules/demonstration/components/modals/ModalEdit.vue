<template>
  <Teleport to="body">
    <ModalBasic
      id="edit-demonstration-modal"
      :modal-open="modalOpen"
      title="Editar demostración"
      @close-modal="handleClose"
    >
      <div class="px-6 py-5">
        <p v-if="isLoading" class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Cargando demostración...
        </p>
        <FormDemonstration
          v-if="modalOpen && demonstrationId"
          :key="demonstrationId"
          ref="formRef"
          mode="edit"
          @submit="handleEdit"
        />
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-6 py-4 dark:border-gray-700/60 dark:bg-gray-900/30">
        <Button variant="secondary" :disabled="isSubmitting || isLoading" @click="handleClose">
          Cancelar
        </Button>
        <Button
          variant="primary"
          :loading="isSubmitting"
          :disabled="isLoading"
          @click="submitForm"
        >
          Guardar
        </Button>
      </div>
    </ModalBasic>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import { Button } from '~/core/ui/buttons'
import { ModalBasic } from '~/core/ui/modal'
import { normalizeDemonstrationResponse } from '../../schema/demonstrations.schema'
import { useDemonstrationsStore } from '../../store/demonstrations.store'
import type { Demonstration, UpdateDemonstration } from '../../types/demonstration.types'
import FormDemonstration from '../forms/forms.vue'

const props = defineProps<{
  modalOpen: boolean
  demonstrationId: string | null
}>()

const emit = defineEmits<{
  'close-modal': []
  updated: []
}>()

const demonstrationsStore = useDemonstrationsStore()
const formRef = ref<InstanceType<typeof FormDemonstration> | null>(null)
const isSubmitting = ref(false)
const isLoading = ref(false)

const waitForFormRef = async () => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await nextTick()
    if (formRef.value) return
  }
}

const loadDemonstration = async (id: string) => {
  isLoading.value = true

  try {
    await waitForFormRef()

    const fromList = demonstrationsStore.demonstrations.find((item) => item.id === id)
    if (fromList) {
      formRef.value?.setValues(fromList)
      return
    }

    const response = await demonstrationsStore.getDemonstrationById(id)
    const demonstration = normalizeDemonstrationResponse(response)

    if (!demonstration) return

    await waitForFormRef()
    formRef.value?.setValues(demonstration)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [props.modalOpen, props.demonstrationId] as const,
  async ([isOpen, id]) => {
    if (!isOpen || !id) return

    await nextTick()
    await loadDemonstration(id)
  },
)

const handleClose = () => {
  if (isSubmitting.value) return
  formRef.value?.reset()
  emit('close-modal')
}

const submitForm = () => {
  formRef.value?.submit()
}

const handleEdit = async (payload: Demonstration | UpdateDemonstration) => {
  if (isSubmitting.value || !props.demonstrationId || !('status' in payload)) return

  const demonstration = payload as UpdateDemonstration

  isSubmitting.value = true

  try {
    await demonstrationsStore.UpdateDemonstration(props.demonstrationId, demonstration)
    await demonstrationsStore.getDemonstrations({
      amount: demonstrationsStore.amount,
      page: demonstrationsStore.page,
    })
    formRef.value?.reset()
    emit('updated')
    emit('close-modal')
  } finally {
    isSubmitting.value = false
  }
}
</script>
