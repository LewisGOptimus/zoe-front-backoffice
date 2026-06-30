import type { Demonstration, GetDemonstrationsResponse, UpdateDemonstration } from "../types/demonstration.types";

export const useDemonstrationService = () => {
    const { $apiBackoffice } = useNuxtApp();

    const getDemonstrations = async (params: { amount: number, page: number }): Promise<GetDemonstrationsResponse> => {
        return $apiBackoffice<GetDemonstrationsResponse>('demonstrations/list', {
            method: 'GET',
            query: {
                amount: params.amount,
                page: params.page,
            },
        });
    }


    const getDemonstrationById = async (id: string): Promise<GetDemonstrationsResponse> => {
        return $apiBackoffice<GetDemonstrationsResponse>('demonstrations/specific/' + id, {
            method: 'GET',
        });
    }

    const createDemonstration = async (params: Demonstration): Promise<GetDemonstrationsResponse> => {
        return $apiBackoffice<GetDemonstrationsResponse>('demonstrations/create', {
            method: 'POST',
            body: params,
        });
    }

    const updateDemonstration = async (id: string, params: UpdateDemonstration): Promise<GetDemonstrationsResponse> => {
        return $apiBackoffice<GetDemonstrationsResponse>('demonstrations/edit/' + id, {
            method: 'PUT',
            body: params,
        });
    }

    const deleteDemonstration = async (id: string) => {
        return $apiBackoffice<unknown>(`demonstrations/delete/${id}`, {
            method: 'DELETE',
        });
    }
    return {
        getDemonstrations,
        getDemonstrationById,
        createDemonstration,
        updateDemonstration,
        deleteDemonstration,
    }
}