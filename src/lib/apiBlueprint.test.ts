import {
  apiBlueprint,
  InferApiBlueprint,
  InferBlueprintResponse,
} from "~/lib/apiBlueprint";
import { optional } from "~/lib/blueprint";

describe("lib: apiBlueprint", () => {
  it("Should be able to handle ApiBlueprint", () => {
    const blueprint = apiBlueprint({
      responseType: "array",
      body: {
        a: String,
        b: optional(Number),
        c: {
          x: Number,
          y: optional(String),
        },
      },
      model: {
        x: String,
        y: Number,
      },
      params: {
        p1: String,
      },
      query: {},
    });
    type TBlueprint = InferApiBlueprint<typeof blueprint>;
    const data: TBlueprint = {
      body: {
        a: "123",
        c: {
          x: 123,
        },
      },
      responseType: "array",
      model: { x: "123", y: 123 },
      params: { p1: "222" },
      query: {},
    };
    const dataComplete: TBlueprint = {
      body: {
        a: "123",
        b: 123,
        c: {
          x: 123,
          y: "123",
        },
      },
      responseType: "array",
      model: { x: "123", y: 123 },
      params: { p1: "222" },
      query: {},
    };
    const blueprintResponse: InferBlueprintResponse<typeof blueprint> = {
      records: [
        {
          x: "123",
          y: 123,
        },
      ],
    };
    expect(true);
  });

  // it("should fail ApiBlueprint",()=>{

  //   const blueprint = apiBlueprint({
  //     responseType: "array",
  //     body: {
  //       a: String,
  //       b: Number,
  // c: {
  //   x: '123'
  // }
  //     },
  //     model: {
  //       x: String,
  //       y: Number,
  //     },
  //     params: {
  //       p1: String,
  //     },
  //     query: {},
  //   });
  //   type TBlueprint = InferBlueprint<typeof blueprint>;
  //   const fail: TBlueprint = {
  //     body: {
  //       a: 123,
  //       b: "123",
  //     },
  //     responseType: "asdf",
  //     model: {x: 123,y: '123'},
  //     params: {p1: 222},
  //     query: {}
  //   };
  //   expect(true);
  // })
});
