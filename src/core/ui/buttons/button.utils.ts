import type {
  ButtonAppearance,
  ButtonColor,
  ButtonVariant,
} from './button.types'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 border-transparent dark:bg-brand-500 dark:hover:bg-brand-600 dark:text-white',
  secondary:
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300',
  tertiary:
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-violet-500',
  danger:
    'bg-red-500 hover:bg-red-600 text-white border-transparent',
  'danger-outline':
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-red-500',
  success:
    'bg-green-500 hover:bg-green-600 text-white border-transparent',
  'success-outline':
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-green-500',
}

const SIZE_CLASSES: Record<string, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn',
  lg: 'btn-lg',
}

const COLOR_APPEARANCE_MAP: Record<ButtonColor, Partial<Record<ButtonAppearance, ButtonVariant>>> = {
  primary: { solid: 'primary' },
  neutral: { outline: 'secondary' },
  violet: { outline: 'tertiary' },
  danger: { solid: 'danger', outline: 'danger-outline' },
  success: { solid: 'success', outline: 'success-outline' },
}

export function resolveButtonVariant(
  variant?: ButtonVariant,
  color: ButtonColor = 'primary',
  appearance: ButtonAppearance = 'solid',
): ButtonVariant {
  if (variant) return variant

  const mapped = COLOR_APPEARANCE_MAP[color]?.[appearance]
  if (mapped) return mapped

  // Fallback razonable
  if (appearance === 'outline') return 'secondary'
  return 'primary'
}

export function getButtonVariantClasses(variant: ButtonVariant): string {
  return VARIANT_CLASSES[variant]
}

export function getButtonSizeClass(size: string): string {
  return SIZE_CLASSES[size] ?? SIZE_CLASSES.md
}

export const BUTTON_DISABLED_CLASSES =
  'disabled:border-gray-200 dark:disabled:border-gray-700 disabled:bg-white dark:disabled:bg-gray-800 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none'

export const BUTTON_GROUP_ACTIVE_CLASSES =
  'text-brand-500'

export const BUTTON_GROUP_INACTIVE_CLASSES =
  'hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300'

export const BUTTON_GROUP_ITEM_CLASSES =
  'rounded-none first:rounded-l-lg last:rounded-r-lg'

export const BUTTON_ICON_DEFAULT_CLASSES =
  'fill-current shrink-0'

export function getButtonIconClasses(variant: ButtonVariant, iconOnly: boolean): string {
  if (iconOnly && (variant === 'danger' || variant === 'danger-outline')) {
    return `${BUTTON_ICON_DEFAULT_CLASSES} text-red-500`
  }
  if (iconOnly && variant === 'tertiary') {
    return `${BUTTON_ICON_DEFAULT_CLASSES} text-violet-500`
  }
  if (variant === 'primary' || variant === 'danger' || variant === 'success') {
    return `${BUTTON_ICON_DEFAULT_CLASSES} text-white/80`
  }
  return `${BUTTON_ICON_DEFAULT_CLASSES} text-gray-400 dark:text-gray-500`
}
