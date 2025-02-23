import dayjs from "dayjs";

export function calculateDateRange(value: Date, granularity: dayjs.OpUnitType) {
  const date = dayjs(value);
  return {
    start: date.startOf(granularity),
    end: date.endOf(granularity),
  };
}
