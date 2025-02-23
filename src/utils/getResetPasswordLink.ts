import { appConfig } from "~/config";
import { urlJoin } from "~/utils/urlJoin";

export function getResetPasswordLink(resetToken: string) {
  return urlJoin(
    appConfig.webApp.url,
    appConfig.webApp.resetPasswordPath,
    resetToken
  );
}
