import { appConfig } from "~/config";
import { generateResetPasswordToken } from "~/utils/generateResetPasswordToken";
import { checkDateWithinOffset } from "~test/utils/checkDateWithinOffset";
import { mockUuidReturn } from "~test/utils/mockUuidReturn";

describe("generateResetPasswordToken", () => {
  it("should generate a reset token with correct TTL and a unique UUID", () => {
    const mockedUuid = mockUuidReturn();

    const result = generateResetPasswordToken();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({
      expiredAt: expect.any(Date),
      token: mockedUuid,
    });
    checkDateWithinOffset(
      result.expiredAt,
      appConfig.app.resetPasswordTokenAgeSeconds
    );
    jest.useRealTimers();
  });
});
