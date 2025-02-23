import { createController } from "~/controllers/public/post/createController";
import { deleteController } from "./deleteController";
import { getController } from "./getController";
import { listController } from "./listController";
import { updateController } from "./updateController";
import { createRouter } from "~/lib/createRouter";

export const postController = createRouter();
postController.get("/", listController);
postController.post("/", createController);
postController.put("/:id", updateController);
postController.get("/:id", getController);
postController.delete("/:id", deleteController);
