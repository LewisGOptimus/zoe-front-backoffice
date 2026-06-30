<template>
  <div class="px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full max-w-[96rem] mx-auto">
    <div class="mb-8 flex flex-col gap-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Empresas
        </h1>

        <Button
          class="w-full sm:w-auto"
          variant="primary"
          aria-controls="new-company-modal"
          @click="handleCreateCompany"
        >
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            </svg>
          </template>
          Nueva empresa
        </Button>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <FilterPills
          v-model="companyFilter"
          :options="companyFilterOptions"
          aria-label="Filtrar empresas"
          wrapper-class="mb-0"
        />

        <div class="flex w-full flex-wrap items-center justify-start sm:w-auto sm:justify-end gap-2 sm:gap-3">
          <div class="w-full sm:w-64">
            <InputSearch
              v-model="searchQuery"
              placeholder="Buscar..."
              search-label="Buscar"
            />
          </div>
          <TableColumnToggle
            v-model="visibleColumnKeys"
            :columns="companyColumns"
            align="right"
            @reset="resetVisibleColumns"
          />
          <ReloadButton :loading="isLoading" @click="handleReload" />
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex min-h-72 items-center justify-center rounded-xl bg-white shadow-xs dark:bg-gray-800">
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Cargando empresas...
      </p>
    </div>

    <UTable
      v-else
      title="Todas las empresas"
      :count="rows.length"
      :columns="visibleColumns"
      :rows="rows"
      show-actions
      actions-mode="inline"
      actions-label="Acciones"
      :action-buttons="actionButtons"
      @action="handleRowAction"
    >
      <template #cell-documentNumber="{ row }">
        <div class="flex flex-col items-start gap-1 text-left">
          <span class="font-medium text-gray-800 dark:text-gray-100">
            {{ row.documentNumber }}
          </span>
          <UBadge
            v-if="row.documentType && row.documentType !== '-'"
            color="violet"
            appearance="soft"
            size="xs"
          >
            {{ formatTableText(row.documentType) }}
          </UBadge>
        </div>
      </template>

      <template #cell-taxResponsibility="{ row }">
        <UBadge
          v-if="row.taxResponsibility && row.taxResponsibility !== '-'"
          :color="isTaxResponsibilityNoAplica(row.taxResponsibility) ? 'neutral' : 'info'"
          appearance="soft"
          size="md"
        >
          {{ formatTableText(row.taxResponsibility) }}
        </UBadge>
        <span v-else class="text-gray-400 dark:text-gray-500">-</span>
      </template>

      <template #cell-businessNature="{ row }">
        <UBadge
          v-if="row.businessNature && row.businessNature !== '-'"
          :color="getBusinessNatureBadgeColor(row.businessNature)"
          appearance="soft"
          size="md"
        >
          {{ formatTableText(row.businessNature) }}
        </UBadge>
        <span v-else class="text-gray-400 dark:text-gray-500">-</span>
      </template>

      <template #cell-municipality="{ row }">
        <div class="flex flex-col items-start gap-1">
          <span class="text-gray-800 dark:text-gray-100">
            {{ row.municipalityCity }}
          </span>
          <UBadge
            v-if="row.municipalityState && row.municipalityState !== '-'"
            color="info"
            appearance="soft"
            size="xs"
          >
            {{ formatTableText(row.municipalityState) }}
          </UBadge>
        </div>
      </template>
    </UTable>

    <div class="mt-8" :class="{ 'pointer-events-none opacity-60': isLoading }">
      <PaginationClassic
        :page="currentPage"
        :amount="amount"
        :total="totalCompanies"
        @change-page="handleChangePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useCatalogStore } from '~/core/catalog/store/catalog.store'
import { useBusinessNatureStore } from '~/core/businessNature/store/businessNature.store'
import {
  companyColumns,
  mapCompaniesToTableRows,
  type CompanyMunicipalityItem,
} from '~/core/company/mappers/company-table.mapper'
import type { Company } from '~/core/company/types/company.types'
import { useCompanyStore } from '~/core/company/store/company.store'
import { useDocumentTypeStore } from '~/core/documentType/store/documentType.store'
import { useTaxResponsibilityStore } from '~/core/taxResponsibility/store/taxResponsibility.store'
import { useUbicationStore } from '~/core/ubication/store/ubication.store'
import { Button, ReloadButton } from '~/core/ui/buttons'
import { FilterPills } from '~/core/ui/filters'
import TableColumnToggle from '~/core/ui/dropdown/TableColumnToggle.vue'
import InputSearch from '~/core/ui/inputs/InputSearch.vue'
import PaginationClassic from '~/core/ui/pagination/PaginationClassic.vue'
import UBadge from '~/core/ui/badge/UBadge.vue'
import UTable from '~/core/ui/Tables/Utable.vue'
import type { UTableActionButton, UTableRow } from '~/core/ui/Tables/utable.types'
import type { BadgeColor } from '~/core/ui/badge/badge.types'
import { toTitleCase } from '~/shared/utils/format'
import { useVisibleTableColumns } from '~/shared/composables/use-visible-table-columns'
import { buildFilterPillOptions, filterItemsByPill } from '~/shared/utils/build-filter-pill-options'
import { filterTableRows } from '~/shared/utils/filter-table-rows'

const catalogStore = useCatalogStore()
const businessNatureStore = useBusinessNatureStore()
const companyStore = useCompanyStore()
const documentTypeStore = useDocumentTypeStore()
const taxResponsibilityStore = useTaxResponsibilityStore()
const ubicationStore = useUbicationStore()

const selectedItems = ref<Array<string | number>>([])
const searchQuery = ref('')
const companyFilter = ref('all')
const currentPage = ref(1)
const amount = ref(10)
const isLoading = ref(true)
const municipalitiesById = ref<Record<string, CompanyMunicipalityItem>>({})

const {
  visibleKeys: visibleColumnKeys,
  visibleColumns,
  resetVisibleColumns,
} = useVisibleTableColumns(companyColumns, { storageKey: 'table-columns:companies' })

const totalCompanies = computed(() => companyStore.total)

const municipalityItems = computed(() => Object.values(municipalitiesById.value))

const normalizeCatalogLabel = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

const isNaturalBusinessNatureId = (businessNatureId: string) => {
  const nature = businessNatureStore.businessNatures.find((item) => item.id === businessNatureId)
  if (!nature) return false
  return normalizeCatalogLabel(nature.name).includes('persona natural')
}

const isJuridicaBusinessNatureId = (businessNatureId: string) => {
  const nature = businessNatureStore.businessNatures.find((item) => item.id === businessNatureId)
  if (!nature) return false
  return normalizeCatalogLabel(nature.name).includes('persona juridica')
}

const companyFilterOptions = computed(() =>
  buildFilterPillOptions<Company>({
    items: companyStore.companies,
    options: [
      { key: 'all', label: 'Todos' },
      {
        key: 'natural',
        label: 'Persona natural',
        match: (company) => isNaturalBusinessNatureId(company.businessNatureId),
      },
      {
        key: 'juridica',
        label: 'Persona jurídica',
        match: (company) => isJuridicaBusinessNatureId(company.businessNatureId),
      },
      { key: 'with-api-key', label: 'Con API Key', match: (company) => company.hasApiKey },
      { key: 'without-api-key', label: 'Sin API Key', match: (company) => !company.hasApiKey },
    ],
  }),
)

const filteredCompanies = computed(() =>
  filterItemsByPill(
    companyStore.companies,
    companyFilter.value,
    'all',
    {
      natural: (company) => isNaturalBusinessNatureId(company.businessNatureId),
      juridica: (company) => isJuridicaBusinessNatureId(company.businessNatureId),
      'with-api-key': (company) => company.hasApiKey,
      'without-api-key': (company) => !company.hasApiKey,
    },
  ),
)

const rows = computed<UTableRow[]>(() =>
  filterTableRows(
    mapCompaniesToTableRows(filteredCompanies.value, {
      businessNatures: businessNatureStore.businessNatures,
      taxResponsibilities: taxResponsibilityStore.taxResponsibilities,
      documentTypes: documentTypeStore.documentTypes,
      municipalities: municipalityItems.value,
    }),
    searchQuery.value,
  ),
)

const actionButtons: UTableActionButton[] = [
  { key: 'edit', label: 'Editar' },
  { key: 'delete', label: 'Eliminar', tone: 'danger' },
]

const fetchMunicipalityNames = async (force = false) => {
  const municipalityIds = [
    ...new Set(companyStore.companies.map((company) => company.municipalityId).filter(Boolean)),
  ]

  if (municipalityIds.length === 0) {
    if (force) municipalitiesById.value = {}
    return
  }

  const resolved = await Promise.all(
    municipalityIds.map(async (id) => {
      if (!force && municipalitiesById.value[id]) {
        return [id, municipalitiesById.value[id]] as const
      }

      const municipality = await ubicationStore.getMunicipalityById(id, force)

      if (!municipality) return null

      return [id, {
        id: municipality.id,
        city: municipality.name,
        state: municipality.state.name,
      }] as const
    }),
  )

  const next: Record<string, CompanyMunicipalityItem> = force
    ? {}
    : { ...municipalitiesById.value }

  for (const entry of resolved) {
    if (entry) next[entry[0]] = entry[1]
  }

  municipalitiesById.value = next
}

const fetchCompanies = async (page: number, force = false) => {
  isLoading.value = true
  currentPage.value = page

  try {
    await catalogStore.preload(force)
    await companyStore.getCompanies({
      amount: amount.value,
      page,
    }, force)
    await fetchMunicipalityNames(force)
    selectedItems.value = []
  } finally {
    isLoading.value = false
  }
}

const handleCreateCompany = () => {
  // TODO: abrir modal o navegar al formulario de creación
  console.log('create company')
}

const handleDeleteSelected = () => {
  // TODO: conectar con API
  console.log('delete', selectedItems.value)
}

const handleRowAction = ({ action, row }: { action: string, row: UTableRow }) => {
  // TODO: conectar con API / navegación
  console.log(action, row.id)
}

const formatTableText = (value: unknown) => {
  if (typeof value !== 'string' || value === '-') return String(value ?? '')
  return toTitleCase(value)
}

const isTaxResponsibilityNoAplica = (value: unknown) => {
  if (typeof value !== 'string') return false
  return value.trim().toLowerCase() === 'no aplica'
}

const getBusinessNatureBadgeColor = (value: unknown): BadgeColor => {
  if (typeof value !== 'string') return 'neutral'

  const normalized = normalizeCatalogLabel(value)

  if (normalized.includes('persona natural')) return 'success'
  if (normalized.includes('persona juridica')) return 'warning'

  return 'neutral'
}

const handleChangePage = async (page: number) => {
  if (isLoading.value || page === currentPage.value) return
  await fetchCompanies(page)
}

const handleReload = async () => {
  if (isLoading.value) return
  await fetchCompanies(currentPage.value, true)
}

onMounted(() => {
  void fetchCompanies(currentPage.value)
})
</script>
