import { Exception } from "~/exceptions/Exception";
import { sortValidationExceptionDetails } from "~/utils/sortValidationExceptionDetails";

export type RequiredBlueprintValidationExceptionDetail = {
  type: "required";
  key: string;
};
export type InvalidValueBlueprintValidationExceptionDetail = {
  type: "invalidValue";
  key: string;
  value: unknown;
  expected?: any;
};
export type InvalidTypeBlueprintValidationExceptionDetail = {
  type: "invalidType";
  key: string;
  value: unknown;
  expected: string | readonly string[];
  actual: string;
};

export type BlueprintValidationExceptionDetail =
  | RequiredBlueprintValidationExceptionDetail
  | InvalidValueBlueprintValidationExceptionDetail
  | InvalidTypeBlueprintValidationExceptionDetail;

export type BlueprintValidationExceptionDetailTypes =
  BlueprintValidationExceptionDetail["type"];

export class BlueprintValidationException extends Exception<
  BlueprintValidationExceptionDetail[]
> {
  public constructor(
    details: BlueprintValidationExceptionDetail[],
    reference?: string
  ) {
    super(
      "blueprintValidation",
      sortValidationExceptionDetails(details),
      reference
    );
  }
}
