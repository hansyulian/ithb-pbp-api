import { Exception } from "~/exceptions/Exception";

export class GenericException extends Exception<{ message: string }> {
  public constructor(message: string, reference?: string) {
    super("generic", { message }, reference);
  }
}
