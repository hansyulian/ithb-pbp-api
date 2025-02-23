export function cleanUndefined<T>(obj: T) {
  const result: any = {
    ...obj,
  };
  for (const key in result) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }
  return result as T;
}
