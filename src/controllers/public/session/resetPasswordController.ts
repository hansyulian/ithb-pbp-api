import {
  simpleStatusBlueprint,
  simpleStatusResponse,
} from "~/config/constants";
import { optional } from "~/lib/blueprint";
import { controller } from "~/lib/controller";
import { setResponseSession } from "~/utils/setResponseSession";

export const resetPasswordController = controller(
  {
    params: {},
    body: {
      token: String,
      password: String,
      applySession: optional(Boolean),
    },
    query: {},
    ...simpleStatusBlueprint,
  },
  async function ({ body, service, response }) {
    const { password, token, applySession } = body;
    const user = await service.session.resetPassword(token, password);
    if (applySession) {
      const { token } = await service.session.userIdLogin(user.id);
      setResponseSession(response, token);
    }
    return simpleStatusResponse;
  }
);
