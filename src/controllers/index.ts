import { createRouter } from "~/lib/createRouter";
import { publicController } from "./public";

export const controllers = createRouter();
controllers.use("/", publicController);
