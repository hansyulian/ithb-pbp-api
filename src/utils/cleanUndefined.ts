export function cleanUndefined<T>(obj: T) {
  const result: any = {};
  for (const key in obj) {
    let processedValue = obj[key] as any;
    if (Array.isArray(obj[key])) {
      processedValue = handleArrayValue(obj[key]);
    } else if (
      typeof processedValue === "object" &&
      !Array.isArray(processedValue) &&
      processedValue !== null &&
      !(processedValue instanceof Date)
    ) {
      processedValue = cleanUndefined(processedValue);
    }
    if (processedValue !== undefined) {
      result[key] = processedValue;
    }
  }
  return result as T;
}

function handleArrayValue(array: Array<any>) {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += 1) {
    const value = array[i];
    if (Array.isArray(value)) {
      result.push(handleArrayValue(value));
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      result.push(cleanUndefined(value));
    } else {
      result.push(value);
    }
  }
  return result;
}
