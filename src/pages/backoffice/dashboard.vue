<template>
  <div class="flex h-dvh overflow-hidden bg-gray-100 dark:bg-gray-900">

    <AppSidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-900">

      <AppHeader :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow px-4 sm:px-6 lg:px-8 py-8">
        <NuxtPage />
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '~/core/layout/sidebar/Sidebar.vue'
import AppHeader from '~/core/layout/Header.vue'

const sidebarOpen = ref(false)
</script>
