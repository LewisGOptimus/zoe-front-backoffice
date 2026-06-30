export function capitalizeFirstLetter(value: string): string {
  const text = value?.trim() ?? ''
  if (!text) return ''

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function toTitleCase(value: string): string {
  const text = value?.trim() ?? ''
  if (!text) return ''

  return text
    .toLowerCase()
    .replace(/\p{L}[\p{L}\p{M}'’-]*/gu, word =>
      word.charAt(0).toUpperCase() + word.slice(1),
    )
}
