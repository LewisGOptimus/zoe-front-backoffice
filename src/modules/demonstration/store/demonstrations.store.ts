import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDemonstrationService } from '../services/demonstration.services';
import type { Demonstration, DemonstrationResponse, PaginatedDemonstrationsResponse, UpdateDemonstration } from '../types/demonstration.types';

export const useDemonstrationsStore = defineStore('demonstrations', () => {
    const demonstrations = ref<DemonstrationResponse[]>([]);
    const total = ref(0);
    const page = ref(1);
    const amount = ref(10);

    const normalizeResponse = (response: DemonstrationResponse[] | PaginatedDemonstrationsResponse): { demonstrations: DemonstrationResponse[]; total: number } => {
        if (Array.isArray(response)) {
            return { demonstrations: response, total: response.length };
        }

        const data = response.data ?? response.items ?? response.demonstrations ?? [];
        return {
            demonstrations: data,
            total: response.total ?? data.length,
        };
    }

    const getDemonstrations = async (params: { amount: number, page: number }) => {
        page.value = params.page;
        amount.value = params.amount;

        const { response } = await useDemonstrationService().getDemonstrations(params);
        const normalized = normalizeResponse(response);

        demonstrations.value = normalized.demonstrations;
        total.value = normalized.total;
    }

    const getDemonstrationById = async (id: string) => {
        const { response } = await useDemonstrationService().getDemonstrationById(id);
        return response;
    }


    const createDemonstration = async (params: Demonstration) => {
        const { response } = await useDemonstrationService().createDemonstration(params);
        return response;
    }

    const UpdateDemonstration =  async(id: string, params: UpdateDemonstration) => {
        const { response } = await useDemonstrationService().updateDemonstration(id, params);
        return response;
    }

    const deleteDemonstration = async (id: string) => {
        await useDemonstrationService().deleteDemonstration(id);
    }

    return {
        demonstrations,
        total,
        page,
        amount,
        getDemonstrations,
        getDemonstrationById,
        createDemonstration,
        UpdateDemonstration,
        deleteDemonstration,
    }
})