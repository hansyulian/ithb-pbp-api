import { controller } from "~/lib/controller";

export const forgetPasswordController = controller(
  {
    params: {},
    body: {
      email: String,
    },
    query: {},
    responseType: "object",
    model: {
      expiredAt: Date,
    },
  },
  async function ({ body, service }) {
    const { email } = body;
    const result = await service.session.forgetPassword(email);
    return result;
  }
);
