import { appConfig } from "~/config";

export function serializeQueryOptions(query: QueryOptions): QueryOptions {
  let limit = query.limit;
  if (!query.limit) {
    limit = appConfig.api.maximumRetrieve;
  } else if (query.limit && query.limit > appConfig.api.maximumRetrieve) {
    limit = appConfig.api.maximumRetrieve;
  }
  const result: QueryOptions = {
    limit,
    skip: query.skip,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
  };

  return result;
}
