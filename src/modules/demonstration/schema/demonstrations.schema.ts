import { z } from 'zod'

import type {
  Demonstration,
  DemonstrationResponse,
  PaginatedDemonstrationsResponse,
  UpdateDemonstration,
} from '../types/demonstration.types'
import { DemonstrationStatus } from '../types/demonstration.types'

const NAME_REGEX = /^[\p{L}\s'.-]+$/u
const PHONE_REGEX = /^\d{7,15}$/
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export const sanitizeDemonstrationName = (value: string) =>
  value.replace(/[^\p{L}\s'.-]/gu, '')

export const sanitizeDemonstrationPhone = (value: string) =>
  value.replace(/\D/g, '').slice(0, 15)

const scheduledDateValue = z.union([
  z.string(),
  z.date(),
  z.array(z.date()),
]).nullable()

const LEGACY_STATUS_MAP: Record<string, DemonstrationStatus> = {
  EXECUTED: DemonstrationStatus.EJECUTADA,
  CANCELLED: DemonstrationStatus.CANCELADA,
}

export const normalizeDemonstrationStatus = (value: unknown): DemonstrationStatus | undefined => {
  if (value == null || value === '') return undefined

  const normalized = String(value).trim().toUpperCase()
  if (LEGACY_STATUS_MAP[normalized]) return LEGACY_STATUS_MAP[normalized]

  if (Object.values(DemonstrationStatus).includes(normalized as DemonstrationStatus)) {
    return normalized as DemonstrationStatus
  }

  return undefined
}

export const demonstrationFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede superar 100 caracteres.')
    .regex(NAME_REGEX, 'El nombre solo puede contener letras.'),
  email: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio.')
    .email('Ingresa un email válido.'),
  phone: z
    .string()
    .trim()
    .min(1, 'El teléfono es obligatorio.')
    .regex(PHONE_REGEX, 'El teléfono debe contener solo números (7 a 15 dígitos).'),
  scheduledDate: scheduledDateValue,
  scheduledTime: z
    .string()
    .trim()
    .min(1, 'La hora es obligatoria.')
    .regex(TIME_REGEX, 'Ingresa una hora válida (HH:mm).'),
  productInterest: z
    .union([z.string(), z.number()])
    .transform(String)
    .pipe(z.string().min(1, 'Selecciona un producto.')),
}).superRefine((data, ctx) => {
  if (!data.scheduledDate) {
    ctx.addIssue({
      code: 'custom',
      message: 'La fecha es obligatoria.',
      path: ['scheduledDate'],
    })
    return
  }

  const parsedDate = parseScheduledDate(data.scheduledDate)
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    ctx.addIssue({
      code: 'custom',
      message: 'Ingresa una fecha válida.',
      path: ['scheduledDate'],
    })
    return
  }

  if (!buildScheduledAt(data.scheduledDate, data.scheduledTime)) {
    ctx.addIssue({
      code: 'custom',
      message: 'La fecha u hora no son válidas.',
      path: ['scheduledDate'],
    })
  }
})

export const demonstrationUpdateFormSchema = demonstrationFormSchema.extend({
  status: z.preprocess(
    normalizeDemonstrationStatus,
    z.nativeEnum(DemonstrationStatus, {
      message: 'Selecciona un estado.',
    }),
  ),
})

export type DemonstrationFormValues = z.input<typeof demonstrationFormSchema>
export type DemonstrationUpdateFormValues = z.input<typeof demonstrationUpdateFormSchema>
export type DemonstrationFormErrors = Record<
  'name' | 'email' | 'phone' | 'scheduledDate' | 'scheduledTime' | 'productInterest' | 'status',
  string
>

export const emptyDemonstrationFormErrors = (): DemonstrationFormErrors => ({
  name: '',
  email: '',
  phone: '',
  scheduledDate: '',
  scheduledTime: '',
  productInterest: '',
  status: '',
})

const formatTimeValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const mapDemonstrationResponseToFormValues = (
  demonstration: DemonstrationResponse,
): DemonstrationUpdateFormValues => {
  const scheduledAt = new Date(demonstration.scheduledAt)

  return {
    name: demonstration.name,
    email: demonstration.email,
    phone: sanitizeDemonstrationPhone(demonstration.phone),
    productInterest: demonstration.productInterest,
    scheduledDate: scheduledAt,
    scheduledTime: formatTimeValue(scheduledAt),
    status: normalizeDemonstrationStatus(demonstration.status) ?? demonstration.status,
  }
}

export const normalizeDemonstrationResponse = (
  response: DemonstrationResponse[] | PaginatedDemonstrationsResponse | DemonstrationResponse,
): DemonstrationResponse | null => {
  if (Array.isArray(response)) {
    return response[0] ?? null
  }

  if ('id' in response && 'status' in response) {
    return response
  }

  const paginated = response as PaginatedDemonstrationsResponse
  const data = paginated.data ?? paginated.items ?? paginated.demonstrations ?? []
  return data[0] ?? null
}

export const parseScheduledDate = (
  value: string | Date | Date[] | null,
): Date | null => {
  if (!value) return null

  if (value instanceof Date) return value

  if (Array.isArray(value)) {
    const firstDate = value[0]
    return firstDate instanceof Date ? firstDate : null
  }

  const parts = value.split('/').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null

  const [day, month, year] = parts
  if (day == null || month == null || year == null) return null

  return new Date(year, month - 1, day)
}

export const buildScheduledAt = (
  scheduledDate: string | Date | Date[] | null,
  scheduledTime: string,
): Date | null => {
  const date = parseScheduledDate(scheduledDate)
  if (!date || !scheduledTime) return null

  const [hours, minutes] = scheduledTime.split(':').map(Number)
  if (hours == null || minutes == null || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
  )
}

export const mapDemonstrationFormErrors = (error: z.ZodError): DemonstrationFormErrors => {
  const errors = emptyDemonstrationFormErrors()

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string' || !(key in errors)) continue
    if (!errors[key as keyof DemonstrationFormErrors]) {
      errors[key as keyof DemonstrationFormErrors] = issue.message
    }
  }

  return errors
}

export const parseDemonstrationForm = (
  values: DemonstrationFormValues,
):
  | { success: true, data: Demonstration }
  | { success: false, errors: DemonstrationFormErrors } => {
  const result = demonstrationFormSchema.safeParse(values)

  if (!result.success) {
    return {
      success: false,
      errors: mapDemonstrationFormErrors(result.error),
    }
  }

  const scheduledAt = buildScheduledAt(
    result.data.scheduledDate,
    result.data.scheduledTime,
  )

  if (!scheduledAt) {
    return {
      success: false,
      errors: {
        ...emptyDemonstrationFormErrors(),
        scheduledDate: 'La fecha u hora no son válidas.',
      },
    }
  }

  return {
    success: true,
    data: {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      productInterest: result.data.productInterest,
      scheduledAt,
    },
  }
}

export const parseDemonstrationUpdateForm = (
  values: DemonstrationUpdateFormValues,
):
  | { success: true, data: UpdateDemonstration }
  | { success: false, errors: DemonstrationFormErrors } => {
  const result = demonstrationUpdateFormSchema.safeParse(values)

  if (!result.success) {
    return {
      success: false,
      errors: mapDemonstrationFormErrors(result.error),
    }
  }

  const scheduledAt = buildScheduledAt(
    result.data.scheduledDate,
    result.data.scheduledTime,
  )

  if (!scheduledAt) {
    return {
      success: false,
      errors: {
        ...emptyDemonstrationFormErrors(),
        scheduledDate: 'La fecha u hora no son válidas.',
      },
    }
  }

  return {
    success: true,
    data: {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      productInterest: result.data.productInterest,
      scheduledAt,
      status: result.data.status,
    },
  }
}
