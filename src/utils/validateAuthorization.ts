import { UnauthorizedException } from "~/exceptions/SessionExceptions";
import { JwtModule } from "~/lib/JwtModule";
import { Session } from "~/models/Session";
import { User, UserRole } from "~/models/User";
import { ServiceSession } from "~/service";

export async function validateAuthorization(
  token: string | undefined,
  roles: UserRole[]
) {
  if (!token) {
    throw new UnauthorizedException();
  }
  try {
    const decoded = await JwtModule.verifyToken(token);
    const { sessionId } = decoded;
    const session = await Session.findByPk(sessionId);
    if (!session) {
      throw new UnauthorizedException();
    }
    const user = await User.findByPk(session.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.status !== "active") {
      throw new UnauthorizedException();
    }
    if (!roles.includes(user.role)) {
      throw new UnauthorizedException();
    }
    const serviceSession: ServiceSession = {
      user,
      session,
    };
    return serviceSession;
  } catch (err) {
    if (!(err instanceof UnauthorizedException)) {
      throw new UnauthorizedException();
    }
    throw err;
  }
}
