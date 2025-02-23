import { optional } from "~/lib/blueprint";
import { controller } from "~/lib/controller";

export const updateController = controller(
  {
    params: {
      id: String,
    },
    query: {},
    responseType: "object",
    body: {
      postId: optional(String),
      content: optional(String),
      authorName: optional(String),
    },
    model: {
      id: String,
      postId: String,
      content: String,
      authorName: optional(String),
      createdAt: Date,
      updatedAt: Date,
    },
  },
  async function ({ params, body, service }) {
    const record = await service.public.postComment.update(params.id, body);
    return record;
  }
);
