export type UTableColumnAlign = 'left' | 'center' | 'right'

/**
 * Tipos de celda del render genérico.
 * - `text`        → texto plano o con variant
 * - `image-label` → imagen + etiqueta
 * - `badge`       → pill con clases dinámicas (`classMap`)
 * - `icon-label`  → icono SVG + texto (`iconMap` en la columna)
 */
export type UTableColumnType = 'text' | 'image-label' | 'badge' | 'icon-label'

export type UTableColumnVariant = 'default' | 'link' | 'success' | 'warning' | 'danger' | 'emphasis'

/** Mapa valor → clases Tailwind. Lo define cada pantalla en su config de columnas. */
export type UTableClassMap = Record<string, string>

export type UTableColumn = {
  key: string
  label: string
  /** @deprecated UTable alinea siempre títulos y celdas a la izquierda. */
  align?: UTableColumnAlign
  /** @deprecated UTable alinea siempre títulos y celdas a la izquierda. */
  headerAlign?: UTableColumnAlign
  type?: UTableColumnType
  variant?: UTableColumnVariant
  /** Campo de la fila con variante dinámica (`link`, `success`, etc.). */
  variantKey?: string
  /** Campo de la fila con la URL de imagen (solo `image-label`). */
  imageKey?: string
  /** Mapa valor → clases CSS (badges, colores condicionales, etc.). */
  classMap?: UTableClassMap
  /** Campo de referencia para resolver `classMap` (p. ej. colorear una columna según otra). */
  classMapKey?: string
  /** Clase por defecto si `classMap` no tiene entrada. */
  classMapFallback?: string
  /** Si es `false`, la columna no aparece en el selector y siempre se muestra. */
  toggleable?: boolean
  /** Mapa valor → paths SVG para `icon-label`. Cada pantalla define el suyo. */
  iconMap?: Record<string, string[]>
}

export type UTableRow = Record<string, unknown> & {
  id?: string | number
}

/** `menu` = botón ⋯. `inline` = botones múltiples en fila. */
export type UTableActionsMode = 'menu' | 'inline'

export type UTableActionButton = {
  key: string
  label: string
  tone?: 'default' | 'danger'
  /** Paths SVG del icono. Si se omite, UTable intenta iconos built-in por `key`. */
  iconPaths?: string[]
}

/** Fallback visual genérico para celdas `badge` sin entrada en `classMap`. */
export const UTABLE_BADGE_FALLBACK_CLASS =
  'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'

/** Fallback genérico para texto coloreado vía `classMap` + `classMapKey`. */
export const UTABLE_TEXT_MAP_FALLBACK_CLASS = 'text-gray-500'
