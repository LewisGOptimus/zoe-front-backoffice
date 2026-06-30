import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useBusinessNatureStore } from '~/core/businessNature/store/businessNature.store'
import { useDocumentTypeStore } from '~/core/documentType/store/documentType.store'
import { useTaxResponsibilityStore } from '~/core/taxResponsibility/store/taxResponsibility.store'
import { useUbicationStore } from '~/core/ubication/store/ubication.store'

export const useCatalogStore = defineStore('catalog', () => {
  const isLoading = ref(false)
  const isLoaded = ref(false)
  let preloadPromise: Promise<void> | null = null

  const preload = async (force = false) => {
    if (!force && isLoaded.value) return
    if (!force && preloadPromise) return preloadPromise

    isLoading.value = true

    preloadPromise = (async () => {
      const businessNatureStore = useBusinessNatureStore()
      const documentTypeStore = useDocumentTypeStore()
      const taxResponsibilityStore = useTaxResponsibilityStore()
      const ubicationStore = useUbicationStore()

      await Promise.all([
        businessNatureStore.getBusinessNatures(force),
        documentTypeStore.getDocumentTypes(force),
        taxResponsibilityStore.getTaxResponsibilities(force),
        ubicationStore.getAllCountries(force),
      ])

      isLoaded.value = true
    })()

    try {
      await preloadPromise
    } catch (error) {
      if (force) {
        isLoaded.value = false
      }
      throw error
    } finally {
      isLoading.value = false
      preloadPromise = null
    }
  }

  const clear = () => {
    isLoaded.value = false
    preloadPromise = null
    isLoading.value = false

    useBusinessNatureStore().clear()
    useDocumentTypeStore().clear()
    useTaxResponsibilityStore().clear()
    useUbicationStore().clear()
  }

  return {
    isLoading,
    isLoaded,
    preload,
    clear,
  }
})
