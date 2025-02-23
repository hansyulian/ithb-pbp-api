type BaseAttributes = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

type CreateOmit<
  T,
  K extends keyof Omit<T, keyof BaseAttributes> = never
> = Omit<T, keyof BaseAttributes | K> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// UpdateOmit reuses CreateOmit and additionally omits "id"
type UpdateOmit<
  T,
  K extends keyof Omit<T, keyof BaseAttributes> = never
> = Omit<Partial<T>, keyof BaseAttributes | K>;

type OmitBase<T> = Omit<T, keyof BaseAttributes>;
