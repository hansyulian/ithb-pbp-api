export function initialValueIndex<Key extends string, Value>(
  keys: readonly Key[] | Key[],
  initialValue: (key: Key) => Value
): Record<Key, Value> {
  const result: Record<Key, Value> = {} as Record<Key, Value>;
  for (const key of keys) {
    result[key] = initialValue(key);
  }
  return result;
}
