import { Exception } from "~/exceptions/Exception";

export class InvalidCredentialException extends Exception {
  constructor(reference?: string) {
    super("InvalidCredential", {}, reference);
  }
}

export class InvalidOldPasswordException extends Exception {
  constructor(reference?: string) {
    super("InvalidOldPassword", {}, reference);
  }
}

export class UnauthorizedException extends Exception {
  constructor(reference?: string) {
    super("Unauthorized", {}, reference);
  }
}

export class UnacceptablePasswordException extends Exception {
  constructor(reference?: string) {
    super("UnacceptablePassword", {}, reference);
  }
}

export class InvalidJwtTokenException extends Exception {
  constructor(reference?: string) {
    super("InvalidJwtToken", {}, reference);
  }
}

export class UserSuspendedException extends Exception {
  constructor(reference?: string) {
    super("UserSuspended", {}, reference);
  }
}

export class ExpiredJwtTokenException extends Exception {
  constructor(reference?: string) {
    super("ExpiredJwtToken", {}, reference);
  }
}
