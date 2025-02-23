import { Router } from "express";
import {
  ApiBlueprint,
  ApiRouterBlueprintInfo,
  ApiRouterInfo,
  ApiRouterSubRouterInfo,
  ApiRouterSummary,
} from "~/lib/apiBlueprint";

import {
  Blueprint,
  InferBlueprint,
  InferBlueprintValueType,
  SerializedType,
  serializeType,
} from "~/lib/blueprint";
import { urlJoin } from "~/utils/urlJoin";

// model should be Blueprint, but it still has infinitely deep error typescript
export function mapResponse(responseType: any, model: any) {
  const modelSpec = mapBlueprintType(model) as any;
  switch (responseType) {
    case "array":
      return {
        records: [modelSpec],
      };
    case "object":
      return modelSpec;
    case "paginatedArray":
      return {
        records: [modelSpec],
        info: {
          count: "number",
        },
      };
  }
  return "unknown";
}

export function mapBlueprintType<TBlueprint extends Blueprint>(
  blueprint: TBlueprint
) {
  const result: any = {};
  for (const key in blueprint) {
    const typing = blueprint[key];
    const serializedType = serializeType(typing);
    if (Array.isArray(serializedType.type) && !serializedType.enum) {
      const resultArray = serializedType.type.map((internalTyping) => {
        const serializedInternalTyping = serializeType(internalTyping);
        return processValue(serializedInternalTyping as never);
      });
      if (serializedType.optional) {
        resultArray.push(null as any);
      }
      result[key] = resultArray as Array<
        InferBlueprintValueType<typeof typing>
      >;
    } else if (
      typeof serializedType.type === "object" &&
      !serializedType.enum
    ) {
      // for deep object type
      result[key] = mapBlueprintType(serializedType.type as any);
    } else {
      result[key] = processValue(serializedType); // for anything else
    }
  }
  return result as InferBlueprint<TBlueprint>;
}

function processValue(serializedType: SerializedType) {
  if (serializedType.enum) {
    if (serializedType.optional) {
      return [...(serializedType.type as any), null];
    }
    return serializedType.type;
  }
  const suffix = serializedType.optional ? " | null" : "";
  switch (serializedType.type) {
    case String:
      return "string" + suffix;
    case Number:
      return "number" + suffix;
    case Boolean:
      return "boolean" + suffix;
    case Date:
      return "date" + suffix;
    case Object:
      return {}; // equivalent to any
  }
  return mapBlueprintType(serializedType.type as never);
}

export function serializeApiBlueprint(
  apiBlueprint: ApiRouterBlueprintInfo,
  parentPath = "/"
) {
  const { path, body, method, model, params, query, responseType } =
    apiBlueprint;
  const normalizedPath = urlJoin(parentPath, path);
  return {
    method,
    path: normalizedPath,
    params: mapBlueprintType(params),
    query: mapBlueprintType(query),
    body: mapBlueprintType(body),
    response: mapResponse(responseType, model),
  };
}

function serializeRouterInfo(parentPath: string, routerInfo: ApiRouterInfo[]) {
  const result: ApiRouterSummary[] = [];
  for (const record of routerInfo) {
    if ((record as ApiRouterSubRouterInfo).info) {
      const { path, info } = record as ApiRouterSubRouterInfo;
      result.push(...serializeRouterInfo(parentPath + "/" + path, info));
    } else {
      result.push(
        serializeApiBlueprint(record as ApiRouterBlueprintInfo, parentPath)
      );
    }
  }
  return result;
}

export function extractApiSummary(controllers: Router) {
  const routerInfo = (controllers as any)._hyRouterInfo as ApiRouterInfo[];
  const result = serializeRouterInfo("/", routerInfo);
  return result;
}
