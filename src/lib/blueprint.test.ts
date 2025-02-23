import {
  optional,
  InferBlueprint,
  options,
  Blueprint,
  serializeType,
} from "~/lib/blueprint";

describe("lib: blueprint", () => {
  it("Blueprint should be able to handle typing", () => {
    const typeDefinition: Blueprint = {
      a: Number,
      b: String,
      c: Boolean,
      d: optional(Number),
      e: Date,
      arr: [Number],
      cmpArr: [Number, String],
      enum: options(["active", "deleted"] as const),
      optionalEnum: optional(options(["active", "deleted"] as const)),
      obj: {
        a: Number,
        b: String,
      },
      objs: [{ x: Number, y: Boolean }],
    };
    type TypeDefinition = InferBlueprint<typeof typeDefinition>;
    const strictTyped: TypeDefinition = {
      a: 123,
      b: "123",
      c: true,
      e: new Date(),
      arr: [123],
      cmpArr: [123, "yes"],
      enum: "active",
      obj: {
        a: 123,
        b: "123",
      },
      objs: [
        {
          x: 123,
          y: true,
        },
      ],
    };
    expect(true);
  });

  it("should be able to extract typing correctly 1", () => {
    expect(serializeType(optional(String))).toEqual({
      type: String,
      optional: true,
      nullable: false,
      enum: false,
    });
  });
  it("should be able to extract typing correctly 2", () => {
    expect(serializeType(optional(options(["active", "draft"])))).toEqual({
      type: ["active", "draft"],
      optional: true,
      nullable: false,
      enum: true,
    });
  });

  // it("all should fail here", () => {
  //   const typeDefinition = {
  //     a: Number,
  //     b: String,
  //     c: Boolean,
  //     d: optional(Number),
  // e: new Date(),
  //     arr: [Number],
  //     cmpArr: [Number, String],
  //   };
  //   type TypeDefinition = InferBlueprint<typeof typeDefinition>;
  //   const failType: TypeDefinition = {
  //     a: '123',
  //     b: 123,
  //     c: 'true',
  //     e: '123',
  //     arr: ['123'],
  //     cmpArr: [true, false],
  //   };
  //   expect(false);
  // });
});
