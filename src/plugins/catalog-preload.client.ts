import { useAuthStore } from '~/core/auth/store/auth.store'
import { useCatalogStore } from '~/core/catalog/store/catalog.store'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  if (authStore.hasValidSession()) {
    void useCatalogStore().preload()
  }
})
