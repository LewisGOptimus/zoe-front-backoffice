import type { DemonstrationResponse, DemonstrationStatus } from "../types/demonstration.types";
import type { UTableColumn, UTableRow } from "~/core/ui/Tables/utable.types";

const STATUS_LABELS: Record<DemonstrationStatus, string> = {
    PENDIENTE: 'Pendiente',
    EJECUTADA: 'Ejecutada',
    CANCELADA: 'Cancelada',
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
    Pendiente: 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    Ejecutada: 'bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    Cancelada: 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-300',
}

const PRODUCT_BADGE_CLASS =
    'bg-blue-500/20 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'

const formatDemonstrationDate = (value: Date | string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

const formatDemonstrationTime = (value: Date | string): string => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date)
}

export const demonstrationColumns: UTableColumn[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'scheduledAt', label: 'Fecha programada' },
    { key: 'phone', label: 'Teléfono' },
    {
        key: 'productInterest',
        label: 'Producto de interés',
        type: 'badge',
        align: 'center',
        classMapFallback: PRODUCT_BADGE_CLASS,
    },
    {
        key: 'status',
        label: 'Estado',
        type: 'badge',
        align: 'center',
        classMap: STATUS_BADGE_CLASSES,
    },
]

export const mapDemonstrationsToTableRows = (demonstrations: DemonstrationResponse[]): UTableRow[] => {
    return demonstrations.map((demonstration) => ({
        id: demonstration.id,
        name: demonstration.name,
        email: demonstration.email,
        scheduledDate: formatDemonstrationDate(demonstration.scheduledAt),
        scheduledTime: formatDemonstrationTime(demonstration.scheduledAt),
        phone: demonstration.phone,
        productInterest: demonstration.productInterest || '-',
        status: STATUS_LABELS[demonstration.status] ?? demonstration.status,
    }));
}