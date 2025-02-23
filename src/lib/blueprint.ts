// The `optional` function simply returns its input but with a unique marker type
export const optional = <DataType>(type: DataType) =>
  ({ _blueprintType: type, optional: true } as const);
export type Optional<T> = { _blueprintType: T; optional: true };
export type AddOptional<T> = T | Optional<T>;

export const nullable = <DataType>(type: DataType) =>
  ({ _blueprintType: type, nullable: true } as const);
export type Nullable<T> = { _blueprintType: T; nullable: true };
export type AddNullable<T> = T | Nullable<T>;

export const options = <DataType>(type: ReadonlyArray<DataType>) =>
  ({ _blueprintType: type, enum: true } as const);
export type Options<T> = { _blueprintType: ReadonlyArray<T>; enum: true };

export type ArrayAble<T> = T | T[];
export type BlueprintTypes = AddOptional<
  ArrayAble<
    | StringConstructor
    | BooleanConstructor
    | NumberConstructor
    | ObjectConstructor
    | DateConstructor
    | Record<string, unknown>
  >
>;
export type Blueprint = Record<string, BlueprintTypes>;

export type InferBlueprint<BlueprintSchema> = UndefinedToOptional<{
  // This part handles properties that are not wrapped in `optional`
  [K in keyof BlueprintSchema]: BlueprintSchema[K] extends Optional<
    infer InnerType
  >
    ? InferBlueprintValueType<InnerType> | undefined
    : BlueprintSchema[K] extends Nullable<infer InnerType>
    ? InferBlueprintValueType<InnerType> | null
    : InferBlueprintValueType<BlueprintSchema[K]>;
}>;

export type InferBlueprintValueType<ConstructorType> =
  ConstructorType extends StringConstructor
    ? string
    : ConstructorType extends NumberConstructor
    ? number
    : ConstructorType extends BooleanConstructor
    ? boolean
    : ConstructorType extends DateConstructor
    ? Date
    : ConstructorType extends ObjectConstructor
    ? object
    : ConstructorType extends Options<infer U>
    ? U
    : // : ConstructorType extends ReadonlyArray<infer U>
    // ? U
    // : ConstructorType extends Array<infer U>
    // ? "this is array"
    ConstructorType extends Record<string, any>
    ? InferBlueprint<ConstructorType>
    : ConstructorType extends Array<infer U>
    ? Array<InferBlueprint<U>>
    : "failToInferValueType";

export type SerializedType = {
  type: BlueprintTypes;
  optional: boolean;
  enum: boolean;
  nullable: boolean;
};
export function serializeType(typing: any): SerializedType {
  const result: SerializedType = {
    type: typing,
    enum: false,
    optional: false,
    nullable: false,
  };
  let temp = typing;
  while (temp._blueprintType) {
    if (temp.optional) {
      result.optional = true;
    }
    if (temp.enum) {
      result.enum = true;
    }
    if (temp.nullable) {
      result.nullable = true;
    }
    temp = temp._blueprintType;
    result.type = temp;
  }
  return result;
}
