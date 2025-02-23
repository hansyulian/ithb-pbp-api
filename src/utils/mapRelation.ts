import { ensureArray } from "~/utils/ensureArray";

export function mapRelation<TRecord extends any, TRelation extends any>(
  data: TRecord,
  relationData: TRelation[],
  idKey: string,
  mapKey: string
): TRecord;
export function mapRelation<TRecord extends any, TRelation extends any>(
  data: TRecord[],
  relationData: TRelation[],
  idKey: string,
  mapKey: string
): TRecord[];

export function mapRelation<
  TRecord extends { id: any },
  TRelation extends { id: any }
>(
  data: TRecord | TRecord[],
  relationData: TRelation[],
  idKey: string,
  mapKey: string
): TRecord[] | TRecord {
  const dataArray = ensureArray(data);
  const relationRecordIndex: Record<string, TRelation> = {};
  for (const record of relationData) {
    relationRecordIndex[record.id] = record;
  }
  for (const record of dataArray) {
    const mapKeyValue = [];
    const ids = ensureArray((record as any)[idKey]);
    for (const id of ids) {
      mapKeyValue.push(relationRecordIndex[id]);
    }
    (record as any)[mapKey] = Array.isArray((record as any)[idKey])
      ? mapKeyValue
      : mapKeyValue[0];
  }

  return Array.isArray(data) ? dataArray : dataArray[0];
}
