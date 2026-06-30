import { defineStore } from 'pinia';
import { capitalizeFirstLetter } from '~/shared/utils/format';
import type { BusinessNature } from '~/core/businessNature/types/businessNature.interface';
import { useBusinessNatureService } from '~/core/businessNature/services/businessNature.service';

export const useBusinessNatureStore = defineStore('businessNature', () => {
  const businessNatureSvc = useBusinessNatureService();

  const businessNatures = ref<BusinessNature[]>([]);

  const setBusinessNatures = (payload: BusinessNature[]) => {
    businessNatures.value = payload.map((item) => ({
      ...item,
      name: capitalizeFirstLetter(item.name),
    }));
  };

  const getBusinessNatures = async (force = false) => {
    if (businessNatures.value.length > 0 && !force) return;
    const { response } = await businessNatureSvc.getBusinessNatures();
    setBusinessNatures(response || []);
  };

  const clear = () => {
    businessNatures.value = [];
  };

  return {
    businessNatures,
    getBusinessNatures,
    clear,
  };
});
