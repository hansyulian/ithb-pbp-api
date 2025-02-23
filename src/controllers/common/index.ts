import { getServerInfoController } from "~/controllers/common/getServerInfoController";
import { createRouter } from "~/lib/createRouter";
import { sessionController } from "./session";

export const commonController = createRouter();
commonController.get("/", getServerInfoController);
commonController.use("/session", sessionController);
