import { Exception, ExceptionGroup } from "~/exceptions/Exception";

export class NotFoundException extends Exception {
  constructor(type: ExceptionGroup, details: any = {}, reference?: string) {
    super(
      "NotFound",
      {
        ...details,
        type,
      },
      reference
    );
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(details: any = {}, reference?: string) {
    super("user", details, reference);
  }
}

export class SessionNotFoundException extends NotFoundException {
  constructor(details: any = {}, reference?: string) {
    super("session", details, reference);
  }
}

export class FileNotFoundException extends NotFoundException {
  constructor(details: any = {}, reference?: string) {
    super("file", details, reference);
  }
}
