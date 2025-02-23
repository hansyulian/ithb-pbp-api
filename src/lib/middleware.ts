import { Request, Response, NextFunction } from "express";

export type CallbackFn = (
  request: Request,
  response: Response
) => PromiseLike<void>;

export function middleware(callback: CallbackFn) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await callback(request, response);
      next();
    } catch (err) {
      next(err);
    }
  };
}
