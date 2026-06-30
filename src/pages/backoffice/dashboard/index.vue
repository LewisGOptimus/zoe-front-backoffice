<template>
  <div class="px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full max-w-[96rem] mx-auto">

    <div class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>

      <div class="flex w-full flex-col gap-5 sm:w-auto sm:items-end">
        <button
          type="button"
          class="btn w-full bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white sm:w-auto"
        >
          <svg class="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span class="max-xs:sr-only">Add View</span>
        </button>

        <div class="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div class="w-full sm:w-64">
            <InputSearch
              v-model="searchQuery"
              placeholder="Buscar..."
              search-label="Buscar"
            />
          </div>
          <FilterButton align="right" />
          <Datepicker align="right" />
          <ReloadButton :loading="isReloading" @click="handleReload" />
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-12 gap-6">

      <!-- Line chart (Acme Plus) -->
      <DashboardCard01 />
      <!-- Line chart (Acme Advanced) -->
      <DashboardCard02 />
      <!-- Line chart (Acme Professional) -->
      <DashboardCard03 />
      <!-- Bar chart (Direct vs Indirect) -->
      <DashboardCard04 />
      <!-- Line chart (Real Time Value) -->
      <DashboardCard05 />
      <!-- Doughnut chart (Top Countries) -->
      <DashboardCard06 />
      <!-- Table (Top Channels) -->
      <DashboardCard07 />
      <!-- Line chart (Sales Over Time) -->
      <DashboardCard08 />
      <!-- Stacked bar chart (Sales VS Refunds) -->
      <DashboardCard09 />
      <!-- Card (Recent Activity) -->
      <DashboardCard10 />
      <!-- Card (Income/Expenses) -->
      <DashboardCard11 />

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reloadNuxtApp } from '#app'

import Datepicker from '~/core/ui/form/Datepicker.vue'
import FilterButton from '~/core/ui/dropdown/DropdownFilter.vue'
import { ReloadButton } from '~/core/ui/buttons'
import InputSearch from '~/core/ui/inputs/InputSearch.vue'
import DashboardCard01 from '~/core/ui/dashboard/DashboardCard01.vue'
import DashboardCard02 from '~/core/ui/dashboard/DashboardCard02.vue'
import DashboardCard03 from '~/core/ui/dashboard/DashboardCard03.vue'
import DashboardCard04 from '~/core/ui/dashboard/DashboardCard04.vue'
import DashboardCard05 from '~/core/ui/dashboard/DashboardCard05.vue'
import DashboardCard06 from '~/core/ui/dashboard/DashboardCard06.vue'
import DashboardCard07 from '~/core/ui/dashboard/DashboardCard07.vue'
import DashboardCard08 from '~/core/ui/dashboard/DashboardCard08.vue'
import DashboardCard09 from '~/core/ui/dashboard/DashboardCard09.vue'
import DashboardCard10 from '~/core/ui/dashboard/DashboardCard10.vue'
import DashboardCard11 from '~/core/ui/dashboard/DashboardCard11.vue'

const searchQuery = ref('')
const isReloading = ref(false)

const handleReload = async () => {
  if (isReloading.value) return
  isReloading.value = true

  try {
    await reloadNuxtApp()
  } finally {
    isReloading.value = false
  }
}
</script>
