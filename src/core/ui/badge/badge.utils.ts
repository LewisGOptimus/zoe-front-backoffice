import type {
  BadgeAppearance,
  BadgeColor,
  BadgeSize,
  BadgeVariant,
} from './badge.types'

const APPEARANCE_CLASSES: Record<BadgeAppearance, Record<BadgeColor, string>> = {
  soft: {
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300',
    primary: 'bg-brand-500/20 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
    success: 'bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    warning: 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    danger: 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    info: 'bg-sky-500/20 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
    violet: 'bg-violet-500/20 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  },
  solid: {
    neutral: 'bg-gray-500 text-white',
    primary: 'bg-brand-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    info: 'bg-sky-500 text-white',
    violet: 'bg-violet-500 text-white',
  },
  outline: {
    neutral: 'border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300',
    primary: 'border border-brand-500/30 text-brand-600 dark:text-brand-300',
    success: 'border border-green-500/30 text-green-700 dark:text-green-300',
    warning: 'border border-yellow-500/30 text-yellow-700 dark:text-yellow-300',
    danger: 'border border-red-500/30 text-red-700 dark:text-red-300',
    info: 'border border-sky-500/30 text-sky-700 dark:text-sky-300',
    violet: 'border border-violet-500/30 text-violet-700 dark:text-violet-300',
  },
}

const DOT_CLASSES: Record<BadgeColor, string> = {
  neutral: 'bg-gray-400',
  primary: 'bg-brand-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  violet: 'bg-violet-500',
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[11px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function resolveBadgeVariant(
  variant?: BadgeVariant,
  color: BadgeColor = 'neutral',
): BadgeVariant {
  return variant ?? color
}

export function getBadgeVariantClasses(
  variant: BadgeVariant,
  appearance: BadgeAppearance,
): string {
  return APPEARANCE_CLASSES[appearance][variant]
}

export function getBadgeSizeClass(size: BadgeSize): string {
  return SIZE_CLASSES[size]
}

export function getBadgeDotClass(variant: BadgeVariant): string {
  return DOT_CLASSES[variant]
}
