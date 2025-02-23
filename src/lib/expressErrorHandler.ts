import { NextFunction, Request, Response } from "express";
import { Exception } from "~/exceptions/Exception";
import { GenericException } from "~/exceptions/GenericException";

export type CustomErrorType = Error | Exception;
export function expressErrorHandler(
  err: CustomErrorType,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const exception: Exception =
    err instanceof Exception ? err : convertGenericErrorToException(err);
  const processedStack = exception.stack?.split("\n") ?? [];
  const exceptionJson = {
    name: exception.name,
    reference: exception.reference,
    details: exception.details,
    stack: processedStack,
  };
  response.status(500).json(exceptionJson);
}

function convertGenericErrorToException(err: Error): GenericException {
  const exception = new GenericException(err.message);
  exception.stack = err.stack;
  return exception;
}
