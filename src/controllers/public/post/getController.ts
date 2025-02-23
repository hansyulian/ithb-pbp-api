import { optional, options } from "~/lib/blueprint";
import { controller } from "~/lib/controller";
import { User } from "~/models/User";

export const getController = controller(
  {
    params: {
      id: String,
    },
    query: {},
    responseType: "object",
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
  async function ({ params, service }) {
    const record = await service.public.post.getById(params.id);
    return record;
  }
);
