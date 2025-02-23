import { FindOptions, OrderItem } from "sequelize";

export function applyQueryOptions<T extends FindOptions>(
  queryOptions: QueryOptions
): FindOptions {
  const { limit, orderBy, orderDirection = "asc", skip = 0 } = queryOptions;
  const result: FindOptions = {};

  if (orderBy) {
    result.order = [[orderBy, orderDirection.toUpperCase()]] as OrderItem[];
  }
  result.offset = skip;
  if (limit) {
    result.limit = limit;
  }
  return result;
}
