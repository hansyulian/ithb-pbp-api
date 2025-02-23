import {
  simpleStatusBlueprint,
  simpleStatusResponse,
} from "~/config/constants";
import { controller } from "~/lib/controller";

export const updatePasswordController = controller(
  {
    params: {},
    body: {
      password: String,
      newPassword: String,
    },
    query: {},
    ...simpleStatusBlueprint,
  },
  async function ({ body, service, response }) {
    const { newPassword, password } = body;
    await service.session.updatePassword(password, newPassword);
    return simpleStatusResponse;
  }
);
