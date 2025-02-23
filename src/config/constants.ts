import { options } from "~/lib/blueprint";

export const simpleStatusBlueprint = {
  model: {
    success: Boolean,
  },
  responseType: "object",
} as const;

export const simpleStatusResponse = {
  success: true,
};

export const searchQueryOptions = {
  orderBy: String,
  orderDirection: options(["asc", "desc"] as const),
  skip: Number,
  limit: Number,
};
