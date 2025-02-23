import { controller } from "~/lib/controller";

const deploymentTimestamp = new Date();

export const getServerInfoController = controller(
  {
    params: {},
    body: {},
    query: {},
    responseType: "object",
    model: {
      alive: Boolean,
      deploymentTimestamp: Date,
      config: Object,
    },
  },
  async function ({ body }) {
    return {
      alive: true,
      deploymentTimestamp,
      config: {},
    };
  }
);
