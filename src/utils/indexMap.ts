export function indexMap<TData>(
  data: TData[],
  getIndex: (value: TData) => string = (value) => (value as any).id
) {
  const result: Record<string, TData> = {};
  for (const record of data) {
    const key = getIndex(record);
    result[key] = record;
  }
  return result;
}
