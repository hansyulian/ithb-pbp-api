import { Request } from "express";
import { controllerWrapper } from "~/lib/simpleControllerWrapper";

export const updateTask = controllerWrapper(async (req: Request) => {
  // Logic to update a task by ID
  return { message: "Task updated successfully" };
});
