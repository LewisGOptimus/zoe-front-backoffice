import type { Company } from '../types/company.types'
import type { UTableColumn, UTableRow } from '~/core/ui/Tables/utable.types'

export type CompanyCatalogItem = {
  id: string
  name: string
}

export type CompanyMunicipalityItem = {
  id: string
  city: string
  state: string
}

export type CompanyTableCatalogs = {
  businessNatures?: CompanyCatalogItem[]
  taxResponsibilities?: CompanyCatalogItem[]
  documentTypes?: CompanyCatalogItem[]
  municipalities?: CompanyMunicipalityItem[]
  vatRegimes?: CompanyCatalogItem[]
}

const ACTIVE_BADGE_CLASSES = {
  Si: 'bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  No: 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-300',
}

export const companyColumns: UTableColumn[] = [
  { key: 'businessName', label: 'Razón social', variant: 'emphasis' },
  { key: 'tradeName', label: 'Nombre comercial' },
  { key: 'documentNumber', label: 'Documento' },
  { key: 'email', label: 'Email' },
  { key: 'taxResponsibility', label: 'Responsabilidad fiscal' },
  { key: 'businessNature', label: 'Naturaleza' },
  { key: 'municipality', label: 'Ciudad' },
  {
    key: 'hasApiKey',
    label: 'API Key',
    type: 'badge',
    align: 'center',
    classMap: ACTIVE_BADGE_CLASSES,
  },
]

const findCatalogName = (
  items: CompanyCatalogItem[] | undefined,
  id: string,
) => items?.find((item) => item.id === id)?.name ?? '-'

const findMunicipality = (
  items: CompanyMunicipalityItem[] | undefined,
  id: string,
) => {
  const municipality = items?.find((item) => item.id === id)

  return {
    city: municipality?.city ?? '-',
    state: municipality?.state ?? '-',
  }
}

const getDisplayName = (company: Company) => {
  const names = [
    company.firstName,
    company.middleName,
    company.lastName,
    company.secondLastName,
  ].filter(Boolean)

  return company.businessName || company.tradeName || names.join(' ') || '-'
}

export const mapCompaniesToTableRows = (
  companies: Company[],
  catalogs: CompanyTableCatalogs = {},
): UTableRow[] => {
  return companies.map((company) => {
    const municipality = findMunicipality(catalogs.municipalities, company.municipalityId)

    return {
      id: company.id,
      businessName: getDisplayName(company),
      tradeName: company.tradeName || '-',
      documentType: findCatalogName(catalogs.documentTypes, company.documentTypeId),
      documentNumber: company.documentNumber || '-',
      email: company.email || '-',
      taxResponsibility: findCatalogName(catalogs.taxResponsibilities, company.taxResponsibilityId),
      businessNature: findCatalogName(catalogs.businessNatures, company.businessNatureId),
      municipality: municipality.city,
      municipalityCity: municipality.city,
      municipalityState: municipality.state,
      vatRegime: findCatalogName(catalogs.vatRegimes, company.vatRegimeId),
      address: company.address || '-',
      hasApiKey: company.hasApiKey ? 'Si' : 'No',
    }
  })
}
