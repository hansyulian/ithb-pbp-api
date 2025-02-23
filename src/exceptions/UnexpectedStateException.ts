import { Exception } from "~/exceptions/Exception";

export class UnexpectedStateException extends Exception {
  constructor(reference?: string) {
    super("UnexpectedState", {}, reference);
  }
}
