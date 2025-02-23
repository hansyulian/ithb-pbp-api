import { searchQueryOptions } from "~/config/constants";
import { optional } from "~/lib/blueprint";
import { controller } from "~/lib/controller";
import { cleanUndefined } from "~/utils/cleanUndefined";
import { queryParser } from "~/utils/queryParser";
import { serializeQueryOptions } from "~/utils/serializeQueryOptions";

export const listController = controller(
  {
    params: {},
    query: {
      title: String,
      content: String,
      authorName: String,
      ...searchQueryOptions,
    },
    responseType: "paginatedArray",
    body: {},
    model: {
      id: String,
      title: String,
      content: String,
      authorName: optional(String),
      createdAt: Date,
      updatedAt: Date,
    },
  },
  async function ({ query, service }) {
    const serializedQuery = cleanUndefined({
      title: queryParser.stringLike(query.title),
      content: queryParser.stringLike(query.content),
      authorName: queryParser.stringLike(query.authorName),
    });

    const result = await service.public.post.list(
      serializedQuery,
      serializeQueryOptions(query)
    );

    return result;
  }
);
