import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCompanyService } from '../services/company.service'
import type { Company, GetCompaniesParams, PaginatedCompaniesResponse } from '../types/company.types'

export type CompanySummary = {
  id: string
  name?: string
}

export const useCompanyStore = defineStore('company', () => {
  const currentCompany = ref<CompanySummary | null>(null)
  const companies = ref<Company[]>([])
  const total = ref(0)
  const page = ref(1)
  const amount = ref(10)
  const cachedPages = ref<Record<string, { companies: Company[]; total: number }>>({})
  const pendingRequests = new Map<string, Promise<void>>()

  const normalizeResponse = (response: Company[] | PaginatedCompaniesResponse): { companies: Company[]; total: number } => {
    if (Array.isArray(response)) {
      return { companies: response, total: response.length }
    }

    const data = response.data ?? response.items ?? response.companies ?? []
    return {
      companies: data,
      total: response.total ?? data.length,
    }
  }

  const getCompanies = async (params: GetCompaniesParams, force = false) => {
    const cacheKey = `${params.page}:${params.amount}`
    page.value = params.page
    amount.value = params.amount

    if (!force && cachedPages.value[cacheKey]) {
      companies.value = cachedPages.value[cacheKey].companies
      total.value = cachedPages.value[cacheKey].total
      return
    }

    const pendingRequest = pendingRequests.get(cacheKey)
    if (!force && pendingRequest) {
      await pendingRequest
      return
    }

    const request = (async () => {
      const { response } = await useCompanyService().getCompanies(params)
      const normalized = normalizeResponse(response)

      companies.value = normalized.companies
      total.value = normalized.total
      cachedPages.value[cacheKey] = normalized
    })()

    pendingRequests.set(cacheKey, request)

    try {
      await request
    } finally {
      pendingRequests.delete(cacheKey)
    }
  }

  const clearCompanyLists = () => {
    currentCompany.value = null
    companies.value = []
    total.value = 0
    cachedPages.value = {}
    pendingRequests.clear()
  }

  return {
    currentCompany,
    clearCompanyLists,
    getCompanies,
    companies,
    total,
    page,
    amount,
  }
})
