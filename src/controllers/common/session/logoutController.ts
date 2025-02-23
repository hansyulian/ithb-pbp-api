import { appConfig } from "~/config";
import {
  simpleStatusBlueprint,
  simpleStatusResponse,
} from "~/config/constants";
import { controller } from "~/lib/controller";

export const logoutController = controller(
  {
    params: {},
    body: {},
    query: {},
    ...simpleStatusBlueprint,
  },
  async function ({ body, service, response }) {
    await service.session.logout();
    response.cookie(appConfig.api.authCookieKey, "", {
      httpOnly: true,
      secure: appConfig.env === "production",
      maxAge: 0,
      sameSite: "strict",
    });
    return simpleStatusResponse;
  }
);
