import {
  AddOptional,
  InferBlueprint,
  ArrayAble,
  Options,
} from "~/lib/blueprint";

export type ApiResponseType =
  | "object"
  | "array"
  | "paginatedArray"
  | "file"
  | "raw";
export type ApiMethods = "get" | "post" | "put" | "delete";
export type ApiQueryValues = ArrayAble<
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | DateConstructor
  | Options<any>
>;
export type ApiQuery = Record<string, ApiQueryValues>;
export type ApiParams = Record<string, StringConstructor | NumberConstructor>;
export type ApiModelValues = AddOptional<
  ArrayAble<
    | StringConstructor
    | BooleanConstructor
    | NumberConstructor
    | ObjectConstructor
    | DateConstructor
    | Record<string, unknown>
  >
>;

export type ApiModel = Record<string, ApiModelValues>;

export type ApiBlueprint<
  TApiResponseType extends ApiResponseType = any,
  TResponseModel extends ApiModel = any,
  TParams extends ApiParams = any,
  TQuery extends ApiQuery = any,
  TBody extends ApiModel = any
> = {
  responseType: TApiResponseType;
  model: TResponseModel;
  params: TParams;
  query: TQuery;
  body: TBody;
};

export type InferApiBlueprint<TApiBlueprint extends ApiBlueprint> = {
  responseType: InferBlueprint<TApiBlueprint["responseType"]>;
  model: InferBlueprint<TApiBlueprint["model"]>;
  params: InferBlueprint<TApiBlueprint["params"]>;
  query: InferBlueprint<TApiBlueprint["query"]>;
  body: InferBlueprint<TApiBlueprint["body"]>;
};

export type ObjectResponse<T> = T;

export type ArrayResponse<T> = {
  records: T[];
};

export type PaginatedArrayResponseInfo = {
  count: number;
};

export type PaginatedArrayResponse<T> = ArrayResponse<T> & {
  info: PaginatedArrayResponseInfo;
};

export type ApiRouterBlueprintInfo = {
  path: string;
  method: ApiMethods;
} & ApiBlueprint;

export type ApiRouterSubRouterInfo = {
  path: string;
  info: ApiRouterInfo[];
};

export type ApiRouterInfo = ApiRouterBlueprintInfo | ApiRouterSubRouterInfo;
export type ApiRouterSummary = {
  path: string;
  method: string;
  body: any;
  response: any;
  params: any;
  query: any;
};
export type InferBlueprintResponseLite<
  TApiBlueprint extends ApiBlueprint,
  TModel extends any = any
> = TApiBlueprint["responseType"] extends "file"
  ? string
  : TApiBlueprint["responseType"] extends "raw"
  ? string
  : TApiBlueprint["responseType"] extends "array"
  ? ArrayResponse<TModel>
  : TApiBlueprint["responseType"] extends "paginatedArray"
  ? PaginatedArrayResponse<TModel>
  : TApiBlueprint["responseType"] extends "object"
  ? ObjectResponse<TModel>
  : "failToInferResponseType";

export type InferBlueprintResponse<
  TApiBlueprint extends ApiBlueprint,
  TModel extends InferApiBlueprint<TApiBlueprint>["model"] = InferApiBlueprint<TApiBlueprint>["model"]
> = TApiBlueprint["responseType"] extends "array"
  ? ArrayResponse<TModel>
  : TApiBlueprint["responseType"] extends "paginatedArray"
  ? PaginatedArrayResponse<TModel>
  : TApiBlueprint["responseType"] extends "object"
  ? ObjectResponse<TModel>
  : "failToInferResponseType";

export function apiBlueprint<
  TApiResponseType extends ApiResponseType,
  TResponseModel extends ApiModel,
  TParams extends ApiParams,
  TQuery extends ApiQuery,
  TBody extends ApiModel,
  TBlueprint extends ApiBlueprint<
    TApiResponseType,
    TResponseModel,
    TParams,
    TQuery,
    TBody
  >
>(blueprint: TBlueprint) {
  return blueprint;
}
