import {
  simpleStatusBlueprint,
  simpleStatusResponse,
} from "~/config/constants";
import { optional, options } from "~/lib/blueprint";
import { controller } from "~/lib/controller";

export const updateProfileController = controller(
  {
    params: {},
    body: {
      name: optional(String),
    },
    query: {},
    ...simpleStatusBlueprint,
  },
  async function ({ body, service }) {
    await service.session.updateProfile(body);
    return simpleStatusResponse;
  }
);
