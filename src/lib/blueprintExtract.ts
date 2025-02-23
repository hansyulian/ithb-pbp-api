import dayjs from "dayjs";
import {
  Blueprint,
  InferBlueprint,
  InferBlueprintValueType,
  SerializedType,
  serializeType,
} from "~/lib/blueprint";

export type BlueprintExtractOptions = {
  looseArray?: boolean;
};

export function blueprintExtract<TBlueprint extends Blueprint>(
  blueprint: TBlueprint,
  data: Record<string, unknown>,
  options: BlueprintExtractOptions = {}
) {
  const result: any = {};
  if (!data) {
    return result;
  }
  for (const key in blueprint) {
    const typing = blueprint[key];
    const value = data[key];
    if (value === undefined || value === null) {
      result[key] = value;
      continue;
    }
    const serializedType = serializeType(typing);

    if (Array.isArray(serializedType.type) && !serializedType.enum) {
      const normalizedArrayValue =
        !Array.isArray(value) && options.looseArray ? [value] : value;
      const resultArray = [];
      const valueArray = normalizedArrayValue as Array<unknown>;
      const internalSerializedType = serializeType(serializedType.type[0]);
      for (const subValue of valueArray) {
        resultArray.push(
          processValue(subValue, internalSerializedType as never, options)
        );
      }
      result[key] = resultArray as Array<
        InferBlueprintValueType<typeof typing>
      >;
    } else if (
      typeof serializedType.type === "object" &&
      !serializedType.enum
    ) {
      // for deep object type
      result[key] = blueprintExtract(serializedType.type as any, value as any);
    } else {
      result[key] = processValue(value, serializedType, options); // for anything else
    }
  }
  return result as InferBlueprint<TBlueprint>;
}

function processValue(
  value: unknown,
  serializedType: SerializedType,
  options: BlueprintExtractOptions
) {
  if (value === undefined) {
    return undefined;
  }
  if (serializedType.enum) {
    return value;
  }
  switch (serializedType.type) {
    case String:
      return value?.toString(); // potential undefined

    case Number:
      const number = parseFloat(value as any); // potential NaN
      if (isNaN(number)) {
        return undefined;
      }
      return number;

    case Boolean:
      return !!value;
    case Date:
      const date = dayjs(value as any);
      if (!date.isValid()) {
        return undefined;
      }
      return date.toDate();
    case Object:
      return value; // equivalent to any
  }
  return blueprintExtract(
    serializedType.type as never,
    value as never,
    options
  );
}
