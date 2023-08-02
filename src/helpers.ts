export function transformToNumber(value: any): number {
  value = typeof value !== 'number' ? Number(value) : value
  return Number.isNaN(value) ? 0 : value
}
