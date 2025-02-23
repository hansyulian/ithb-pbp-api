import { UnauthorizedException } from "~/exceptions/UnauthorizedException";
import { JwtModule } from "~/lib/JwtModule";
import { appConfig } from "~/config";
import { mockRequestGenerator } from "~test/utils/mockRequetsGenerator";
import { authorizationMiddleware } from "~/middlewares/authorizationMiddleware";
import { authFixture } from "~test/fixtures/authFixture";
import { idGenerator } from "~test/utils/idGenerator";
import { resetData } from "~test/utils/resetData";

import { UserRole, User } from "~/models/User";
import { ServiceSession } from "~/service";
import { Session } from "~/models/Session";

describe("middleware: authorizationMiddleware", () => {
  beforeEach(async () => {
    await resetData();
    await authFixture();
  });

  async function getServiceSession(value: UserRole | number) {
    const userId =
      typeof value === "number"
        ? idGenerator.user(value)
        : idGenerator.auth(value);
    const sessionId =
      typeof value === "number"
        ? idGenerator.session(value)
        : idGenerator.auth(value);

    const [user, session] = await Promise.all([
      User.findByPk(userId),
      Session.findByPk(sessionId),
    ]);
    if (!user || !session) {
      throw new Error("Session not found, maybe forgot to run authFixture?");
    }
    const serviceSession: ServiceSession = {
      session,
      user,
    };
    return serviceSession;
  }

  it("should authenticate and set user session with a valid query token", async () => {
    const serviceSession = await getServiceSession("admin");
    const { request, response, next } = mockRequestGenerator({
      query: { auth: serviceSession.session.token },
      body: {},
      header: {},
      cookies: {},
    });

    await authorizationMiddleware()(request, response, next);
    expect(next).toHaveBeenCalledWith();

    expect(response.locals.service.serviceSession?.user.id).toEqual(
      serviceSession.user.id
    );
    expect(response.locals.service.serviceSession?.session.id).toEqual(
      serviceSession.session.id
    );
  });

  it("should authenticate and set user session with a valid header token", async () => {
    const serviceSession = await getServiceSession("admin");
    const { request, response, next } = mockRequestGenerator({
      query: {},
      body: {},
      header: { Authorization: `Bearer ${serviceSession.session.token}` },
      cookies: {},
    });

    await authorizationMiddleware()(request, response, next);
    expect(next).toHaveBeenCalledWith();

    expect(response.locals.service.serviceSession?.user.id).toEqual(
      serviceSession.user.id
    );
    expect(response.locals.service.serviceSession?.session.id).toEqual(
      serviceSession.session.id
    );
  });

  it("should authenticate and set user session with a valid cookie token", async () => {
    const serviceSession = await getServiceSession("admin");
    const { request, response, next } = mockRequestGenerator({
      query: {},
      body: {},
      header: {},
      cookies: { [appConfig.api.authCookieKey]: serviceSession.session.token },
    });

    await authorizationMiddleware()(request, response, next);
    expect(next).toHaveBeenCalledWith();
    expect(response.locals.service.serviceSession?.user.id).toEqual(
      serviceSession.user.id
    );
    expect(response.locals.service.serviceSession?.session.id).toEqual(
      serviceSession.session.id
    );
  });

  it("should pass UnauthorizedException to next if no token is found", async () => {
    const { request, response, next } = mockRequestGenerator({
      query: {},
      body: {},
      header: {},
      cookies: {},
    });

    await authorizationMiddleware()(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    expect(response.locals.service.serviceSession).toBeUndefined();
  });

  it("should pass UnauthorizedException to next if the token is expired", async () => {
    const { request, response, next } = mockRequestGenerator({
      query: {
        auth: await JwtModule.signToken(
          { sessionId: idGenerator.auth("admin") },
          -1000
        ),
      },
      body: {},
      header: {},
      cookies: {},
    });

    await authorizationMiddleware()(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    expect(response.locals.service.serviceSession).toBeUndefined();
  });

  it("should pass UnauthorizedException to next for an invalid token", async () => {
    const { request, response, next } = mockRequestGenerator({
      query: { auth: "invalid-token" },
      body: {},
      header: {},
      cookies: {},
    });

    await authorizationMiddleware()(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    expect(response.locals.service.serviceSession).toBeUndefined();
  });
  it("should pass UserSuspendedException if the user is suspended", async () => {
    const serviceSession = await getServiceSession("admin");
    serviceSession.user.status = "suspended";
    await serviceSession.user.save();
    const { request, response, next } = mockRequestGenerator({
      query: { auth: serviceSession.session.token },
      body: {},
      header: {},
      cookies: {},
    });

    await authorizationMiddleware()(request, response, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedException));
    expect(response.locals.service.serviceSession).toBeUndefined();
  });
});
