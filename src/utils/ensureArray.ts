export function ensureArray<T>(data: T | T[]): T[] {
  if (!Array.isArray(data)) {
    return [data];
  }
  return data;
}
