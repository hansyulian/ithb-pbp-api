import { Request } from "express";
import { controllerWrapper } from "~/lib/simpleControllerWrapper";

export const createTask = controllerWrapper(async (req: Request) => {
  // Logic to create a new task
  return { message: "Task created successfully" };
});
