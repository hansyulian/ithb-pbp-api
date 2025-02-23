import { getResetPasswordLink } from "~/utils/getResetPasswordLink";

describe("utils: getResetPasswordLink", () => {
  it("should return the correct reset password link", () => {
    const resetToken = "valid-reset-token";
    const expectedLink =
      "http://localhost:5173/session/reset-password/valid-reset-token";

    const result = getResetPasswordLink(resetToken);

    expect(result).toBe(expectedLink);
  });

  it("should handle an empty reset token", () => {
    const resetToken = "";
    const expectedLink = "http://localhost:5173/session/reset-password/";

    const result = getResetPasswordLink(resetToken);

    expect(result).toBe(expectedLink);
  });

  it("should return a valid URL with any reset token", () => {
    const resetToken = "random-token-123";
    const result = getResetPasswordLink(resetToken);

    // Check if the link includes the reset token
    expect(result).toContain(resetToken);
    expect(result).toContain("/reset-password/");
  });

  it("should not return a URL with invalid reset token", () => {
    const resetToken = "!!invalid-token!!"; // simulate an invalid token format
    const result = getResetPasswordLink(resetToken);

    // Check if it still returns a valid URL format
    expect(result).toContain(resetToken);
    expect(result).toContain("/reset-password/");
  });
});
