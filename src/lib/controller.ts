import { NextFunction, Request, Response } from "express";
import { BlueprintValidationException } from "~/exceptions/BlueprintValidationExceptions";
import { FileNotFoundException } from "~/exceptions/NotFoundExceptions";
import {
  ApiBlueprint,
  ApiModel,
  ApiParams,
  ApiQuery,
  ApiResponseType,
  InferApiBlueprint,
  InferBlueprintResponseLite,
} from "~/lib/apiBlueprint";
import { blueprintExtract } from "~/lib/blueprintExtract";
import { blueprintValidate } from "~/lib/blueprintValidate";
import { Service } from "~/service";
import fs from "fs";

export type ControllerContext<Params, Query, Body> = {
  params: Params;
  query: Partial<Query>;
  body: Body;
  locals: Express.Locals;
  request: Request;
  response: Response;
  service: Service;
};
export type ControllerFn<ReturnType, Params, Query, Body> = (
  context: ControllerContext<Params, Query, Body>
) => PromiseLike<ReturnType> | ReturnType;

export function controller<
  TApiResponseType extends ApiResponseType,
  TResponseModel extends ApiModel,
  TParams extends ApiParams,
  TQuery extends ApiQuery,
  TBody extends ApiModel,
  TApiBlueprint extends ApiBlueprint<
    TApiResponseType,
    TResponseModel,
    TParams,
    TQuery,
    TBody
  >,
  ControllerBlueprint extends InferApiBlueprint<TApiBlueprint>
>(
  apiBlueprint: TApiBlueprint,
  controllerFn: ControllerFn<
    // InferBlueprintResponse<TApiBlueprint>,
    InferBlueprintResponseLite<TApiBlueprint>, // use this first instead of the InferBlueprintResponse, because of the null conversion
    ControllerBlueprint["params"],
    ControllerBlueprint["query"],
    ControllerBlueprint["body"]
  >
) {
  type TBParams = ControllerBlueprint["params"];
  type TBQuery = ControllerBlueprint["query"];
  type TBBody = ControllerBlueprint["body"];
  const controllerAction = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const queryValidationResult = blueprintValidate(
        apiBlueprint.query,
        request.query,
        "query",
        { mode: "loose", skipRequired: true, looseArray: true }
      );
      const paramsValidationResult = blueprintValidate(
        apiBlueprint.params,
        request.params,
        "params"
      );
      const bodyValidationResult = blueprintValidate(
        apiBlueprint.body,
        request.body,
        "body",
        { mode: "loose" }
      );
      const exceptions = [
        ...paramsValidationResult.errors,
        ...queryValidationResult.errors,
        ...bodyValidationResult.errors,
      ];
      if (exceptions.length > 0) {
        throw new BlueprintValidationException(exceptions);
      }

      const controllerContext: ControllerContext<TBParams, TBQuery, TBBody> = {
        body: blueprintExtract(apiBlueprint.body, request.body) as never,
        locals: response.locals,
        params: blueprintExtract(apiBlueprint.params, request.params) as never,
        query: blueprintExtract(apiBlueprint.query, request.query, {
          looseArray: true,
        }) as never,
        service: response.locals.service,
        request,
        response,
      };
      let result = (await controllerFn(controllerContext)) as any;
      if (apiBlueprint.responseType === "file") {
        if (!fs.existsSync(result)) {
          return next(new FileNotFoundException({ name: result }));
        }
        response.sendFile(result);
      } else if (apiBlueprint.responseType === "raw") {
        response.send(result);
      } else {
        switch (apiBlueprint.responseType) {
          case "array":
          case "paginatedArray":
            for (const i in result.records) {
              result.records[i] = blueprintExtract(
                apiBlueprint.model,
                result.records[i] as never
              );
            }
            break;
          case "object":
            result = blueprintExtract(apiBlueprint.model, result as never);
            break;
        }
        response.status(200).json(result); // here we no need to care about the data typing anymore
      }
    } catch (err) {
      next(err);
    }
  };
  controllerAction._hyBlueprint = apiBlueprint; // attach the blueprint to the controller for auto docs
  return controllerAction;
}
