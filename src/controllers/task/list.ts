import { Request } from "express";
import { controllerWrapper } from "~/lib/simpleControllerWrapper";

export const listTask = controllerWrapper(async (req: Request) => {
  // Logic to list all tasks
  return { message: "Tasks listed successfully" };
});
