// Import necessary modules
import { Response } from "express";
import { appConfig } from "~/config";
import { setResponseSession } from "~/utils/setResponseSession";

describe("setResponseSession", () => {
  let responseMock: Response;

  beforeEach(() => {
    // Mock the response object
    responseMock = {
      cookie: jest.fn(),
    } as any;
  });

  it("should set a cookie with the correct parameters", () => {
    const token = "sampleToken";

    setResponseSession(responseMock, token);

    expect(responseMock.cookie).toHaveBeenCalledWith(
      appConfig.api.authCookieKey,
      token,
      {
        httpOnly: true,
        secure: appConfig.env === "production",
        maxAge: appConfig.jwt.expiry * 1000,
        sameSite: "strict",
      }
    );
  });

  it("should set the secure flag to true in production", () => {
    const originalEnv = appConfig.env;
    appConfig.env = "production"; // Temporarily set to production

    const token = "sampleToken";

    setResponseSession(responseMock, token);

    expect(responseMock.cookie).toHaveBeenCalledWith(
      appConfig.api.authCookieKey,
      token,
      expect.objectContaining({
        secure: true,
      })
    );

    appConfig.env = originalEnv; // Restore original environment
  });

  it("should set the secure flag to false in non-production environments", () => {
    const originalEnv = appConfig.env;
    appConfig.env = "development"; // Temporarily set to development

    const token = "sampleToken";

    setResponseSession(responseMock, token);

    expect(responseMock.cookie).toHaveBeenCalledWith(
      appConfig.api.authCookieKey,
      token,
      expect.objectContaining({
        secure: false,
      })
    );

    appConfig.env = originalEnv; // Restore original environment
  });

  it("should set the maxAge correctly based on the JWT expiry", () => {
    const token = "sampleToken";

    setResponseSession(responseMock, token);

    expect(responseMock.cookie).toHaveBeenCalledWith(
      appConfig.api.authCookieKey,
      token,
      expect.objectContaining({
        maxAge: appConfig.jwt.expiry * 1000,
      })
    );
  });
});
