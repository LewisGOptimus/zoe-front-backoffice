<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-100 flex w-full max-w-sm flex-col gap-3 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          v-for="notification in notificationStore.items"
          :key="notification.id"
          class="pointer-events-auto"
        >
          <Notification
            :type="notification.type"
            :open="notification.open"
            @update:open="(value) => !value && notificationStore.remove(notification.id)"
          >
            <div
              class="font-medium text-gray-800 dark:text-gray-100"
              :class="{ 'mb-1': notification.message }"
            >
              {{ notification.title }}
            </div>
            <div v-if="notification.message">{{ notification.message }}</div>
          </Notification>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Notification from './Notification.vue'
import { useNotificationAlertStore } from './notification-alert.store'

const notificationStore = useNotificationAlertStore()
</script>
