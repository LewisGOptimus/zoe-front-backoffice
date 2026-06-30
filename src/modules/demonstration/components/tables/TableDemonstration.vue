<template>
<div class="w-full max-w-[96rem] mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
        <div class="mb-4 sm:mb-0">
            <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Demostraciones
            </h1>
        </div>

        <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <div class="w-56">
                <InputSearch
                    v-model="searchQuery"
                    placeholder="Buscar..."
                    search-label="Buscar"
                />
            </div>

            <Button
                variant="primary"
                aria-controls="create-demonstration-modal"
                @click.stop="emit('create')"
            >
                <template #icon>
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                </template>
                Agendar Demostración
            </Button>
        </div>
    </div>

    <UTable
        title="Todas las demostraciones"
        :count="demonstrations.length"
        :columns="demonstrationColumns"
        :rows="demonstrations"
        show-actions
        actions-mode="inline"
        actions-label="Acciones"
        :action-buttons="actionButtons"
        @action="handleRowAction"
    >
        <template #cell-scheduledAt="{ row }">
            <div class="flex flex-col items-start gap-1">
                <span class="text-gray-800 dark:text-gray-100">
                    {{ row.scheduledDate }}
                </span>
                <UBadge color="info" appearance="soft" size="xs">
                    {{ row.scheduledTime }}
                </UBadge>
            </div>
        </template>
    </UTable>

    <div class="mt-8">
        <PaginationClassic
            :page="currentPage"
            :amount="amount"
            :total="total"
            @change-page="handleChangePage"
        />
    </div>
</div>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import PaginationClassic from '~/core/ui/pagination/PaginationClassic.vue'
import { Button } from '~/core/ui/buttons'
import UBadge from '~/core/ui/badge/UBadge.vue'
import InputSearch from '~/core/ui/inputs/InputSearch.vue'
import UTable from '~/core/ui/Tables/Utable.vue'
import type { UTableActionButton, UTableRow } from '~/core/ui/Tables/utable.types'
import { filterTableRows } from '~/shared/utils/filter-table-rows'
import {
    demonstrationColumns,
    mapDemonstrationsToTableRows,
} from '../../mappers/demonstration-tables-mappers'
import { useDemonstrationsStore } from '../../store/demonstrations.store'

const emit = defineEmits<{
  create: []
  edit: [id: string]
  delete: [payload: { id: string, name: string }]
}>()

const demonstrationsStore = useDemonstrationsStore()
const searchQuery = ref('')

const demonstrations = computed(() =>
    filterTableRows(
        mapDemonstrationsToTableRows(demonstrationsStore.demonstrations),
        searchQuery.value,
    ),
)

const total = computed(() => demonstrationsStore.total)

const currentPage = computed(() => demonstrationsStore.page)

const amount = computed(() => demonstrationsStore.amount)

const actionButtons: UTableActionButton[] = [
    { key: 'edit', label: 'Editar' },
    { key: 'delete', label: 'Eliminar', tone: 'danger' },
]

const handleChangePage = async (page: number) => {
    await demonstrationsStore.getDemonstrations({
        amount: amount.value,
        page,
    })
}

const handleRowAction = async ({ action, row }: { action: string, row: UTableRow }) => {
    if (row.id == null) return

    if (action === 'edit') {
        emit('edit', String(row.id))
        return
    }

    if (action === 'delete') {
        emit('delete', {
            id: String(row.id),
            name: String(row.name ?? ''),
        })
    }
}

onMounted(async () => {
    await demonstrationsStore.getDemonstrations({
        amount: amount.value,
        page: currentPage.value,
    })
})
</script>