import { Router } from "express";
import { createTask } from "./create";
import { getTask } from "./get";
import { updateTask } from "./update";
import { deleteTask } from "./delete";
import { listTask } from "~/controllers/task/list";

export const taskController = Router();
taskController.get("/", listTask);
taskController.post("/", createTask);
taskController.get("/:id", getTask);
taskController.put("/:id", updateTask);
taskController.delete("/:id", deleteTask);
