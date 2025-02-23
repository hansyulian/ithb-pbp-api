import { createController } from "~/controllers/public/postComment/createController";
import { deleteController } from "./deleteController";
import { getController } from "./getController";
import { listController } from "./listController";
import { updateController } from "./updateController";
import { createRouter } from "~/lib/createRouter";

export const postcommentController = createRouter();
postcommentController.get("/", listController);
postcommentController.post("/", createController);
postcommentController.put("/:id", updateController);
postcommentController.get("/:id", getController);
postcommentController.delete("/:id", deleteController);
