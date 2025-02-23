import { NextFunction, Request, Response } from "express";
import { appConfig } from "~/config";
import { Exception } from "~/exceptions/Exception";
import { GenericException } from "~/exceptions/GenericException";
import { UnauthorizedException } from "~/exceptions/SessionExceptions";

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
    stack: appConfig.api.exposeErrorStack ? processedStack : undefined,
  };
  if (err instanceof UnauthorizedException) {
    response.status(401).json(exceptionJson);
  } else {
    response.status(500).json(exceptionJson);
  }
  if (appConfig.app.logError) {
    console.error(
      JSON.stringify({ ...exceptionJson, stack: processedStack }, null, 4)
    );
  }
}

function convertGenericErrorToException(err: Error): GenericException {
  const exception = new GenericException(err.message);
  exception.stack = err.stack;
  return exception;
}
