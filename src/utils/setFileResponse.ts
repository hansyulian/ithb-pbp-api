import { Response } from "express";

export function setFileResponse(response: Response, name: string) {
  response.setHeader("Content-type", "text/plain");
  response.setHeader("Content-Disposition", `attachment; filename="${name}"`);
}
