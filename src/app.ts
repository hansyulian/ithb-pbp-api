import morgan from "morgan";

import express from "express";

import cookieParser from "cookie-parser";
import { initializationMiddleware } from "~/middlewares/initializationMiddleware";
import { ServiceOptions } from "~/service";
import { controllers } from "~/controllers";
import { expressErrorHandler } from "~/lib/expressErrorHandler";
import { extractApiSummary } from "~/lib/extractApiSummary";
import { setupDatabase } from "~/lib/sequelize";

type Options = {
  exposeApiSummary?: boolean;
} & ServiceOptions;

export async function createApp(options: Options) {
  const app = express();
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    initializationMiddleware({
      mailer: options.mailer,
      sequelizeInstance: options.sequelizeInstance,
    })
  );
  app.use(controllers);
  if (options.exposeApiSummary) {
    console.log("api docs exposed at /docs");
    app.get("/docs", (request, response) => {
      response.json(extractApiSummary(controllers));
    });
  }
  app.use(expressErrorHandler);
  return app;
}
