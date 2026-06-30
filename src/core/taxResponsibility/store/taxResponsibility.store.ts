import { defineStore } from 'pinia';
import { capitalizeFirstLetter } from '~/shared/utils/format';
import type { TaxResponsibility } from '~/core/taxResponsibility/types/taxResponsibility.interface';
import { useTaxResponsibilityService } from '~/core/taxResponsibility/services/taxResponsibility.service';

export const useTaxResponsibilityStore = defineStore('taxResponsibility', () => {
  const taxResponsibilitySvc = useTaxResponsibilityService();

  const taxResponsibilities = ref<TaxResponsibility[]>([]);

  const setTaxResponsibilities = (payload: TaxResponsibility[]) => {
    taxResponsibilities.value = payload.map((item) => ({
      ...item,
      name: capitalizeFirstLetter(item.name),
    }));
  };

  const getTaxResponsibilities = async (force = false) => {
    if (taxResponsibilities.value.length > 0 && !force) return;
    const { response } = await taxResponsibilitySvc.getTaxResponsibilities();
    setTaxResponsibilities(response || []);
  };

  const clear = () => {
    taxResponsibilities.value = [];
  };

  return {
    taxResponsibilities,
    getTaxResponsibilities,
    clear,
  };
});
