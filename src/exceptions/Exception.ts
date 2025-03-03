export abstract class Exception<Details extends object = {}> extends Error {
  public reference?: string;
  public name: string;
  public details: Details;
  public static _isException: boolean = true;

  public constructor(name: string, details: Details, reference?: string) {
    super(
      JSON.stringify({
        name,
        details,
        reference,
      })
    );
    this.reference = reference;
    this.name = name;
    this.details = details;
  }
}

export type ExceptionGroup =
  | "user"
  | "session"
  | "file"
  | "post"
  | "postComment";
