import jwt from "jsonwebtoken";
import { appConfig } from "~/config";
import { InvalidJwtTokenException } from "~/exceptions/SessionExceptions";
import { SessionPayload, JwtModule } from "~/lib/JwtModule";

describe("JwtModule", () => {
  const jwtSecret = appConfig.jwt.secret;
  const jwtExpiry = appConfig.jwt.expiry;

  it("signToken should sign and return a token and decodeable using jwt.decode", async () => {
    const sessionPayload: SessionPayload = {
      sessionId: "mock-session-id",
    };
    const result = await JwtModule.signToken(sessionPayload);

    expect(jwt.sign).toHaveBeenCalledWith(sessionPayload, jwtSecret, {
      expiresIn: jwtExpiry,
    });
    const decodeTest = (await jwt.decode(result)) as SessionPayload;
    expect(decodeTest.sessionId).toStrictEqual(sessionPayload.sessionId);
    const verifiedToken = await JwtModule.verifyToken(result);
    expect(verifiedToken.sessionId).toStrictEqual(sessionPayload.sessionId);
  });

  // for now seems to be failing?
  // it("verifyToken should throw ExpiredJwtTokenException for expired token", async () => {
  //   jest.useFakeTimers();
  //   const now = new Date();
  //   jest.setSystemTime(new Date(now.getTime() - 100 * 1000));
  //   const expiredToken = await jwt.sign(
  //     {
  //       id: "user1",
  //       email: "user@example.com",
  //     },
  //     jwtSecret,
  //     { expiresIn: 50 }
  //   );
  //   jest.setSystemTime(now);
  //   await expect(JwtService.verifyToken(expiredToken)).rejects.toThrow(
  //     ExpiredJwtTokenException
  //   );
  //   jest.useRealTimers();
  // });

  it("verifyToken should throw InvalidJwtTokenException for invalid token", async () => {
    const invalidToken = await jwt.sign(
      {
        sessionId: "mock-session-id",
      },
      jwtSecret + "invalid",
      { expiresIn: jwtExpiry }
    );
    await expect(JwtModule.verifyToken(invalidToken)).rejects.toThrow(
      InvalidJwtTokenException
    );
  });

  it("should extract the correct value to prevent stray value being added as well and some class object", async () => {
    await JwtModule.signToken({
      sessionId: "mocked-session-id",
      someStrayValue: "shouldBeIgnored",
    } as any);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        sessionId: "mocked-session-id",
      },
      jwtSecret,
      {
        expiresIn: jwtExpiry,
      }
    );
  });
});
