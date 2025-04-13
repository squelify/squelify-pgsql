import superjson from 'superjson'

/**
 * Custom encoder to handle special cases and remove quotes for primitive values
 * while keeping JSON format for objects
 * @param value - Value to be encoded
 */
export function storeEncode(value: any): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'object') return superjson.stringify(value)
  return String(value)
}

/**
 * Custom decoder to parse values correctly
 * @param value - Value to be decoded
 */
export function storeDecode(value: string): any {
  if (value === 'null') return null
  if (value === '') return null
  if (value === 'undefined') return undefined

  // Try parsing as number
  const num = Number(value)
  if (!Number.isNaN(num)) return num

  // Try parsing as JSON for objects
  try {
    return superjson.parse(value)
  } catch {
    // If not JSON, return as is
    return value
  }
}
