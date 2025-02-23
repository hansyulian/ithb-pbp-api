type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type UndefinedAddNull<T> = {
  [K in keyof T]: T[K] extends undefined ? T[K] | null : T[K] | null;
};

type QueryOptions = Partial<{
  skip: number;
  limit: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
}>;
