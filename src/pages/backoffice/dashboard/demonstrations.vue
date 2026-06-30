<template>
  <div>
    <TableDemonstration
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <ModalCreate
      :modal-open="createModalOpen"
      @close-modal="closeCreateModal"
    />

    <ModalEdit
      :modal-open="editModalOpen"
      :demonstration-id="selectedDemonstrationId"
      @close-modal="closeEditModal"
    />

    <ModalDelete
      :modal-open="deleteModalOpen"
      :demonstration-id="selectedDeleteId"
      :demonstration-name="selectedDeleteName"
      @close-modal="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'

import ModalCreate from '~/modules/demonstration/components/modals/ModalCreate.vue'
import ModalDelete from '~/modules/demonstration/components/modals/ModalDelete.vue'
import ModalEdit from '~/modules/demonstration/components/modals/ModalEdit.vue'
import TableDemonstration from '~/modules/demonstration/components/tables/TableDemonstration.vue'

const createModalOpen = ref(false)
const editModalOpen = ref(false)
const deleteModalOpen = ref(false)
const selectedDemonstrationId = ref<string | null>(null)
const selectedDeleteId = ref<string | null>(null)
const selectedDeleteName = ref('')

const openCreateModal = () => {
  createModalOpen.value = true
}

const closeCreateModal = () => {
  createModalOpen.value = false
}

const openEditModal = async (id: string) => {
  selectedDemonstrationId.value = id
  await nextTick()
  editModalOpen.value = true
}

const closeEditModal = () => {
  editModalOpen.value = false
  selectedDemonstrationId.value = null
}

const openDeleteModal = async ({ id, name }: { id: string, name: string }) => {
  selectedDeleteId.value = id
  selectedDeleteName.value = name
  await nextTick()
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  deleteModalOpen.value = false
  selectedDeleteId.value = null
  selectedDeleteName.value = ''
}
</script>
