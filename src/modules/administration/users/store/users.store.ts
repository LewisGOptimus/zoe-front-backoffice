import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useUsersService } from '../services/users.services';
import type { GetUsersParams, PaginatedUsersResponse, User } from '../types/users.types';

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const total = ref(0);
    const page = ref(1);
    const amount = ref(10);
    const cachedPages = ref<Record<string, { users: User[]; total: number }>>({});
    const pendingRequests = new Map<string, Promise<void>>();

    const normalizeResponse = (response: User[] | PaginatedUsersResponse): { users: User[]; total: number } => {
        if (Array.isArray(response)) {
            return { users: response, total: response.length };
        }

        const data = response.data ?? response.items ?? response.users ?? [];
        return {
            users: data,
            total: response.total ?? data.length,
        };
    };

    const getUsers = async (params: GetUsersParams, force = false) => {
        const cacheKey = `${params.page}:${params.amount}`;
        page.value = params.page;
        amount.value = params.amount;

        if (!force && cachedPages.value[cacheKey]) {
            users.value = cachedPages.value[cacheKey].users;
            total.value = cachedPages.value[cacheKey].total;
            return;
        }

        const pendingRequest = pendingRequests.get(cacheKey);
        if (!force && pendingRequest) {
            await pendingRequest;
            return;
        }

        const request = (async () => {
            const { response } = await useUsersService().getUsers(params);
            const normalized = normalizeResponse(response);

            users.value = normalized.users;
            total.value = normalized.total;
            cachedPages.value[cacheKey] = normalized;
        })();

        pendingRequests.set(cacheKey, request);

        try {
            await request;
        } finally {
            pendingRequests.delete(cacheKey);
        }
    }
    return {
        users,
        total,
        page,
        amount,
        cachedPages,
        getUsers,
    }
})
