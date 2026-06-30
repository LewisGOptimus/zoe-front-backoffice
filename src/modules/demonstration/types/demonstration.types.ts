import type { ApiResponse } from '~/shared/interfaces/api';

export interface Demonstration {
    name: string;
    email: string;
    scheduledAt: Date;
    phone: string;
    productInterest: string;
}

export enum DemonstrationStatus {
    PENDIENTE = 'PENDIENTE',
    EJECUTADA = 'EJECUTADA',
    CANCELADA = 'CANCELADA',
}

export interface DemonstrationResponse {
    id: string;
    name: string;
    email: string;
    scheduledAt: Date;
    phone: string;
    productInterest: string;
    status: DemonstrationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateDemonstration extends Demonstration {
    status: DemonstrationStatus;
}


export type GetDemonstrationsParams = {
    amount: number;
    page: number;
};

export type PaginatedDemonstrationsResponse = {
    data?: DemonstrationResponse[];
    items?: DemonstrationResponse[];
    demonstrations?: DemonstrationResponse[];
    total?: number;
    page?: number;
    amount?: number;
    totalPages?: number;
};

export type UpdateDemonstrationRequest = UpdateDemonstration;
export type GetDemonstrationsResponse = ApiResponse<DemonstrationResponse[] | PaginatedDemonstrationsResponse>;
