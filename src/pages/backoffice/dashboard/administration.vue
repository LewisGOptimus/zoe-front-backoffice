<template>
  <div class="w-full max-w-[96rem] mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Administración</h1>

      <div class="w-56">
        <InputSearch
          v-model="searchQuery"
          placeholder="Buscar..."
          search-label="Buscar"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import InputSearch from '~/core/ui/inputs/InputSearch.vue'

const searchQuery = ref('')
</script>