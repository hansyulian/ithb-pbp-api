import morgan from "morgan";

import express from "express";

import cookieParser from "cookie-parser";
import { expressErrorHandler } from "~/lib/expressErrorHandler";
import { controllers } from "~/controllers";
type Options = {};

export async function createApp(options: Options = {}) {
  const app = express();
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(cookieParser());

  app.use(controllers);
  app.use(expressErrorHandler);
  return app;
}
