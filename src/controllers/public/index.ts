import { getServerInfoController } from "~/controllers/public/getServerInfoController";
import { createRouter } from "~/lib/createRouter";
import { sessionController } from "./session";
import { postController } from "~/controllers/public/post";
import { postcommentController } from "~/controllers/public/postComment";

export const publicController = createRouter();
publicController.get("/", getServerInfoController);
publicController.use("/session", sessionController);
publicController.use("/post", postController);
publicController.use("/post-comment", postcommentController);
