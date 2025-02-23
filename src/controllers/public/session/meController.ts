import { optional, options } from "~/lib/blueprint";
import { controller } from "~/lib/controller";

export const meController = controller(
  {
    params: {},
    body: {},
    query: {},
    responseType: "object",
    model: {
      name: String,
      email: String,
      status: String,
      role: String,
    },
  },
  async function ({ service }) {
    const result = await service.session.getUserInfo();
    return result;
  }
);
