import { Service, ServiceOptions } from "~/service";
import { middleware } from "~/lib/middleware";

export const initializationMiddleware = (serviceOptions: ServiceOptions) =>
  middleware(async (request, response) => {
    response.locals.service = new Service(serviceOptions);
  });
