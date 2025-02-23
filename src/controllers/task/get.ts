import { Request } from "express";
import { controllerWrapper } from "~/lib/simpleControllerWrapper";

export const getTask = controllerWrapper(async (req: Request) => {
  // Logic to get a task by ID
  return { message: "Task retrieved successfully" };
});
