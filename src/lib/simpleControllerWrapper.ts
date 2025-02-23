import { Request, Response, NextFunction } from "express";

export type ControllerFn<ReturnType> = (req: Request) => Promise<ReturnType>;
export function controllerWrapper<ReturnType = any>(
  controllerFn: ControllerFn<ReturnType>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await controllerFn(req);
      res.status(200).send(result);
      return;
    } catch (err) {
      next(err);
      return;
    }
  };
}
