import { controller } from "~/lib/controller";
import { setResponseSession } from "~/utils/setResponseSession";

export const emailLoginController = controller(
  {
    params: {},
    body: {
      email: String,
      password: String,
    },
    query: {},
    responseType: "object",
    model: {
      token: String,
    },
  },
  async function ({ body, service, response }) {
    const { email, password } = body;
    const result = await service.session.emailLogin(email, password);
    setResponseSession(response, result.token);
    return result;
  }
);
