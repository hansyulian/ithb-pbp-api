import { Request } from "express";
import { controllerWrapper } from "~/lib/simpleControllerWrapper";

export const deleteTask = controllerWrapper(async (req: Request) => {
  // Logic to delete a task by ID
  return { message: "Task deleted successfully" };
});
