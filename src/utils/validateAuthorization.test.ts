import { UnauthorizedException } from "~/exceptions/UnauthorizedException";
import { JwtModule } from "~/lib/JwtModule";
import { idGenerator } from "~test/utils/idGenerator";
import { userFixture } from "~test/fixtures/userFixture";
import { validateAuthorization } from "~/utils/validateAuthorization";
import { User } from "~/models/User";
import { Session } from "~/models/Session";

describe("utils: validateAuthorization", () => {
  const testSession = {
    userId: idGenerator.user(0),
    sessionId: idGenerator.session(0),
  };
  let validToken: string;
  let expiredToken: string;

  beforeAll(async () => {
    validToken = await JwtModule.signToken(testSession, 3600); // 1-hour expiry for tests
    expiredToken = await JwtModule.signToken(testSession, -1); // Already expired token
    await userFixture();
  });

  it("should return valid session details when session is correct", async () => {
    const result = await validateAuthorization(validToken, [
      "employee",
      "admin",
    ]);
    const user = await User.findByPk(testSession.userId);
    const session = await Session.findByPk(testSession.sessionId);
    expect(result.user.id).toStrictEqual(user?.id);
    expect(result.session.id).toStrictEqual(session?.id);
  });
  it("should throw UnauthorizedException if role is invalid", async () => {
    expect(validateAuthorization(validToken, ["admin"])).rejects.toThrow(
      UnauthorizedException
    );
  });

  it("should throw UnauthorizedException if no token is found", async () => {
    expect(
      validateAuthorization(undefined, ["employee", "admin"])
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if the token is expired", async () => {
    expect(
      validateAuthorization(expiredToken, ["employee", "admin"])
    ).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException for an invalid token", async () => {
    expect(
      validateAuthorization("invalid token", ["employee", "admin"])
    ).rejects.toThrow(UnauthorizedException);
  });
});
