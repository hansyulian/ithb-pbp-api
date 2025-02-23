import { createRouter } from "~/lib/createRouter";
import { commonController } from "./common";

export const controllers = createRouter();
controllers.use("/", commonController);
