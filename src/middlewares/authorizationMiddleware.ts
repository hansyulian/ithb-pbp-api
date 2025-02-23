import { appConfig } from "~/config";
import { UserSuspendedException } from "~/exceptions/SessionExceptions";
import { middleware } from "~/lib/middleware";
import { UserRole } from "~/models/User";
import { validateAuthorization } from "~/utils/validateAuthorization";

export const authorizationMiddleware = (
  roles: UserRole[] = ["common", "admin"]
) => {
  const sortedRoles = roles.sort();
  return middleware(async (request, response) => {
    // priority: query -> header -> cookie
    const authToken =
      request.query.auth ||
      request.header("Authorization")?.replace("Bearer ", "") ||
      request.cookies?.[appConfig.api.authCookieKey];
    const serviceSession = await validateAuthorization(authToken, sortedRoles);
    if (serviceSession.user.status === "suspended") {
      throw new UserSuspendedException();
    }
    response.locals.service.serviceSession = serviceSession;
  });
};
