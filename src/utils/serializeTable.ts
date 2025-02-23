export type SerializeTableFieldSpec<TData> = {
  label: string;
  getValue: (document: TData) => unknown;
};

export function serializeTable<TData>(
  data: TData[],
  fields: SerializeTableFieldSpec<TData>[]
) {
  const rows = [];
  for (const record of data) {
    const row: any[] = [];
    for (const field of fields) {
      const getValue = field.getValue;
      row.push(getValue(record));
    }
    rows.push(row);
  }
  return rows;
}
