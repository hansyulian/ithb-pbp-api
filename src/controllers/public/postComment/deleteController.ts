import {
  simpleStatusBlueprint,
  simpleStatusResponse,
} from "~/config/constants";
import { controller } from "~/lib/controller";

export const deleteController = controller(
  {
    params: {
      id: String,
    },
    query: {},
    body: {},
    ...simpleStatusBlueprint,
  },
  async function ({ params, service }) {
    await service.public.postComment.delete(params.id);
    return simpleStatusResponse;
  }
);
