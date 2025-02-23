import { RequestHandler, Router } from "express";
import { ApiBlueprint, ApiMethods, ApiRouterInfo } from "~/lib/apiBlueprint";

export function createRouter() {
  const router = Router();
  const originalGet = router.get;
  const originalPost = router.post;
  const originalPut = router.put;
  const originalDelete = router.delete;
  const originalUse = router.use;
  const routerInfo: ApiRouterInfo[] = [];
  (router as any)._hyRouterInfo = routerInfo;
  const registerController = (
    method: ApiMethods,
    path: string,
    ...handlers: Array<RequestHandler>
  ) => {
    for (const handler of handlers) {
      // finding if has the blueprint specification
      const blueprint = (handler as any)._hyBlueprint as ApiBlueprint;
      if (blueprint) {
        routerInfo.push({
          method,
          path,
          ...blueprint,
        });
      }
    }
  };
  router.get = (path: any, ...handlers: any[]) => {
    registerController("get", path, ...handlers);
    return originalGet.apply(router, [path, ...handlers] as any);
  };
  router.post = (path: any, ...handlers: any[]) => {
    registerController("post", path, ...handlers);
    return originalPost.apply(router, [path, ...handlers] as any);
  };
  router.put = (path: any, ...handlers: any[]) => {
    registerController("put", path, ...handlers);
    return originalPut.apply(router, [path, ...handlers] as any);
  };
  router.delete = (path: any, ...handlers: any[]) => {
    registerController("delete", path, ...handlers);
    return originalDelete.apply(router, [path, ...handlers] as any);
  };
  router.use = (...params: any[]) => {
    if (typeof params[0] === "string") {
      const [path, ...subParams] = params;
      for (const subParam of subParams) {
        if (!subParam) {
          continue;
        }
        const hyRouterInfo = subParam._hyRouterInfo;
        if (hyRouterInfo) {
          routerInfo.push({
            path,
            info: hyRouterInfo,
          });
        }
      }
    }
    return originalUse.apply(router, [...params] as any);
  };

  return router;
}
