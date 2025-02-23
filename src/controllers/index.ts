import { Router } from "express";
import { taskController } from "~/controllers/task";

export const controllers = Router();
controllers.use("/task", taskController);
