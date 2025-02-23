import dayjs from "dayjs";
import { appConfig } from "~/config";
import { uuid } from "~/utils/uuid";

export function generateResetPasswordToken() {
  const expiredAt = dayjs()
    .add(appConfig.app.resetPasswordTokenAgeSeconds, "s")
    .toDate();
  return {
    expiredAt,
    token: uuid(),
  };
}
