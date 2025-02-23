import { isValidEmail } from "~/utils/isValidEmail";

describe("utils: isValidEmail", () => {
  it("should return true for a valid email address", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user+alias@example.co.uk")).toBe(true);
    expect(isValidEmail("name123@subdomain.example.org")).toBe(true);
  });

  it("should return false for an email without '@'", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
    expect(isValidEmail("plainaddress")).toBe(false);
  });

  it("should return false for an email without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user@.com")).toBe(false);
    expect(isValidEmail("user@example.")).toBe(false);
  });

  it("should return false for an email with invalid characters", () => {
    expect(isValidEmail("user@exa mple.com")).toBe(false);
    expect(isValidEmail("user@exa<mple.com")).toBe(false);
    expect(isValidEmail("user@exa>mple.com")).toBe(false);
  });

  it("should return false for an empty email string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});
