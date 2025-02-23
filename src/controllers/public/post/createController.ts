import { optional } from "~/lib/blueprint";
import { controller } from "~/lib/controller";

export const createController = controller(
  {
    params: {},
    query: {},
    responseType: "object",
    body: {
      title: String,
      content: String,
      authorName: optional(String),
    },
    model: {
      id: String,
      title: String,
      content: String,
      authorName: optional(String),
      createdAt: Date,
      updatedAt: Date,
    },
  },
  async function ({ body, service }) {
    const record = await service.public.post.create(body);
    return record;
  }
);
