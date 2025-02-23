import { BlueprintValidationExceptionDetail } from "~/exceptions/BlueprintValidationExceptions";

export function sortValidationExceptionDetails(
  details: BlueprintValidationExceptionDetail[]
) {
  const result = [...details];
  result.sort((left, right) => {
    if (left.key === right.key) {
      return left.type > right.type ? 1 : -1;
    }
    return left.key > right.key ? 1 : -1;
  });
  return result;
}
