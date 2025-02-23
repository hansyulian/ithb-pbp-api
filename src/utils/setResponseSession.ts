import { Response } from "express";
import { appConfig } from "~/config";

export function setResponseSession(response: Response, token: string) {
  response.cookie(appConfig.api.authCookieKey, token, {
    httpOnly: true,
    secure: appConfig.env === "production",
    maxAge: appConfig.jwt.expiry * 1000,
    sameSite: "strict",
  });
}
