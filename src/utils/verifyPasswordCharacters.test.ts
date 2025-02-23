import { verifyPasswordCharacters } from "~/utils/verifyPasswordCharacters";

describe("utils: verifyPasswordCharacters", () => {
  it("should return true for valid passwords", () => {
    const validPasswords = [
      "StrongPassw0rd!",
      "Another@Password123",
      "Valid#Password2024",
      "Complex$Pass99&",
    ];

    validPasswords.forEach((password) => {
      expect(verifyPasswordCharacters(password)).toBe(true);
    });
  });

  it("should return false for passwords missing an uppercase letter", () => {
    const invalidPasswords = [
      "weakpassw0rd!",
      "another@password123",
      "valid#password2024",
      "complex$pass99&",
    ];

    invalidPasswords.forEach((password) => {
      expect(verifyPasswordCharacters(password)).toBe(false);
    });
  });

  it("should return false for passwords missing a lowercase letter", () => {
    const invalidPasswords = [
      "WEAKPASSW0RD!",
      "ANOTHER@PASSWORD123",
      "VALID#PASSWORD2024",
      "COMPLEX$PASS99&",
    ];

    invalidPasswords.forEach((password) => {
      expect(verifyPasswordCharacters(password)).toBe(false);
    });
  });

  it("should return false for passwords missing a number", () => {
    const invalidPasswords = [
      "WeakPassword!",
      "Another@Password",
      "Valid#Password",
      "Complex$Pass&",
    ];

    invalidPasswords.forEach((password) => {
      expect(verifyPasswordCharacters(password)).toBe(false);
    });
  });

  it("should return false for passwords missing a special character", () => {
    const invalidPasswords = [
      "WeakPassword0",
      "AnotherPassword123",
      "ValidPassword2024",
      "ComplexPass99",
    ];

    invalidPasswords.forEach((password) => {
      expect(verifyPasswordCharacters(password)).toBe(false);
    });
  });

  it("should return false for passwords shorter than 12 characters", () => {
    const invalidPasswords = ["ShrtP1!", "Small@123", "Pwd#99&", "Abc1!"];

    invalidPasswords.forEach((password) => {
      expect(verifyPasswordCharacters(password)).toBe(false);
    });
  });

  it("should return false for empty or null values", () => {
    const invalidPasswords = ["", null, undefined];

    invalidPasswords.forEach((password) => {
      // @ts-ignore: Test for null and undefined values
      expect(verifyPasswordCharacters(password)).toBe(false);
    });
  });
});
