import dayjs from "dayjs";
import { BlueprintValidationExceptionDetail } from "~/exceptions/BlueprintValidationExceptions";
import {
  Blueprint,
  BlueprintTypes,
  SerializedType,
  serializeType,
} from "~/lib/blueprint";
import { sortValidationExceptionDetails } from "~/utils/sortValidationExceptionDetails";

export type BlueprintValidationOptions = {
  mode?: "strict" | "loose";
  looseDate?: boolean;
  skipRequired?: boolean;
  looseArray?: boolean; // when using query string, if only send as array ["value1"], it will be considered single string rather than array. this will enable the validator to accept Array mode if the blueprint is array but value is single value
};

export function blueprintValidate<TBlueprint extends Blueprint>(
  blueprint: TBlueprint,
  data: Record<string, unknown>,
  parentKey: string = "",
  options: BlueprintValidationOptions = {}
) {
  const errors: BlueprintValidationExceptionDetail[] = [];
  const normalizedParentKey = parentKey === "" ? "" : `${parentKey}.`;
  for (const key in blueprint) {
    const typing = blueprint[key];
    const value = data[key];
    const serializedType = serializeType(typing);
    const currentKey = `${normalizedParentKey}${key}`;
    const isEmpty = isEmptyValue(value);
    if (
      ((!serializedType.nullable && value === null) ||
        (!serializedType.optional && value === undefined)) &&
      !options.skipRequired
    ) {
      errors.push({ type: "required", key: currentKey });
    } else if (!isEmpty) {
      if (Array.isArray(serializedType.type) && !serializedType.enum) {
        const normalizedArrayValue =
          !Array.isArray(value) && options.looseArray ? [value] : value;
        if (!Array.isArray(normalizedArrayValue)) {
          errors.push({
            actual: typeof normalizedArrayValue,
            expected: "array",
            key: currentKey,
            type: "invalidType",
            value: normalizedArrayValue,
          });
        } else {
          const valueArray = normalizedArrayValue as Array<unknown>;
          serializedType.type = serializedType.type[0];
          for (const i in valueArray) {
            const result = validateValue(
              valueArray[i],
              serializedType,
              `${currentKey}.${i}`,
              options
            );
            errors.push(...result.errors);
          }
        }
      } else if (
        typeof serializedType.type === "object" &&
        !serializedType.enum
      ) {
        const result = blueprintValidate(
          serializedType.type as never,
          value as never,
          currentKey,
          options
        );
        errors.push(...result.errors);
      } else {
        const result = validateValue(
          value,
          serializedType,
          currentKey,
          options
        ); // for anything else
        errors.push(...result.errors);
      }
    }
  }
  return {
    errors: sortValidationExceptionDetails(errors),
  };
}

function validateValue(
  value: unknown,
  serializedType: SerializedType,
  parentKey: string,
  options: BlueprintValidationOptions
) {
  const errors: BlueprintValidationExceptionDetail[] = [];
  if (serializedType.enum) {
    if (typeof value !== "string") {
      errors.push({
        type: "invalidType",
        key: parentKey,
        value,
        expected: serializedType.type as any,
        actual: typeof value,
      });
    } else if (!(serializedType.type as unknown[]).includes(value)) {
      errors.push({
        type: "invalidValue",
        key: parentKey,
        value: value,
        expected: serializedType.type as unknown[],
      });
    }
  } else {
    const unexpectedType =
      options.mode === "loose"
        ? looseValidation(value, serializedType.type)
        : strictValidation(value, serializedType.type, options);
    if (unexpectedType) {
      errors.push({
        type: "invalidType",
        actual: typeof value,
        expected: unexpectedType,
        key: parentKey,
        value,
      });
    }
  }
  return {
    errors,
  };
}

function isEmptyValue(value: unknown) {
  return value === undefined || value === null;
}

function strictValidation(
  value: unknown,
  type: BlueprintTypes,
  options: BlueprintValidationOptions
) {
  switch (type) {
    case String:
      if (typeof value !== "string") {
        return "string";
      }
      break;
    case Number:
      if (typeof value !== "number") {
        return "number";
      }
      break;
    case Date:
      if (!options.looseDate && !(value instanceof Date)) {
        return "date";
      }
      const date = dayjs(value as any);
      if (!date.isValid()) {
        return "date";
      }
      break;
    case Boolean:
      if (typeof value !== "boolean") {
        return "boolean";
      }
      break;
    case Object:
      if (typeof value !== "object") {
        return "object";
      }
  }
  return undefined;
}

function looseValidation(value: unknown, type: BlueprintTypes) {
  switch (type) {
    case String:
      if (!["boolean", "string", "number"].includes(typeof value)) {
        // loose mode
        return "string";
      }
      break;
    case Number:
      if (typeof value !== "number" && isNaN(value as any)) {
        // loose mode
        return "number";
      }
      break;
    case Date:
      const date = dayjs(value as any);
      if (!date.isValid() || typeof value === "boolean") {
        return "date";
      }
      break;
    case Boolean:
      if (value !== "true" && value !== "false" && typeof value !== "boolean") {
        return "boolean";
      }
      break;
    case Object:
      if (typeof value !== "object") {
        return "object";
      }
  }
  return undefined;
}
