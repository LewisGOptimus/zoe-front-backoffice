<template>
  <ModalShell
    :id="id"
    :modal-open="modalOpen"
    position="top"
    size="2xl"
    @close-modal="emit('close-modal')"
  >
    <form class="border-b border-gray-100 dark:border-gray-700/60">
          <div class="relative">
            <label :for="searchId" class="sr-only">Search</label>
            <input :id="searchId" class="w-full dark:text-gray-300 bg-white dark:bg-gray-800 border-0 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 pl-10 pr-4" type="search" placeholder="Search Anything…" ref="searchInput" />
            <button class="absolute inset-0 right-auto group" type="submit" aria-label="Search">
              <svg class="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-4 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
              </svg>
            </button>
          </div>
        </form>
        <div class="py-4 px-2">
          <!-- Recent searches -->
          <div class="mb-3 last:mb-0">
            <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Recent searches</div>
            <ul class="text-sm">
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                  </svg>
                  <span>Form Builder - 23 hours on-demand video</span>
                </router-link>
              </li>
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                  </svg>
                  <span>Access Mosaic on mobile and TV</span>
                </router-link>
              </li>
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                  </svg>
                  <span>Product Update - Q4 2024</span>
                </router-link>
              </li>
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                  </svg>
                  <span>Master Digital Marketing Strategy course</span>
                </router-link>
              </li>
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                  </svg>
                  <span>Dedicated forms for products</span>
                </router-link>
              </li>
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                  </svg>
                  <span>Product Update - Q4 2024</span>
                </router-link>
              </li>
            </ul>
          </div>
          <!-- Recent pages -->
          <div class="mb-3 last:mb-0">
            <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Recent pages</div>
            <ul class="text-sm">
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                  </svg>
                  <span><span class="font-medium">Messages</span> - <span class="text-gray-600 dark:text-gray-400">Conversation / … / Mike Mills</span></span>
                </router-link>
              </li>
              <li>
                <router-link class="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg" to="#0" @click="$emit('close-modal')">
                  <svg class="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                  </svg>
                  <span><span class="font-medium">Messages</span> - <span class="text-gray-600 dark:text-gray-400">Conversation / … / Eva Patrick</span></span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
  </ModalShell>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import ModalShell from './ModalShell.vue'

const props = defineProps<{
  id: string
  searchId: string
  modalOpen: boolean
}>()

const emit = defineEmits<{
  'open-modal': []
  'close-modal': []
}>()

const searchInput = ref<HTMLInputElement | null>(null)

watch(() => props.modalOpen, (open) => {
  if (open) nextTick(() => searchInput.value?.focus())
})
</script>