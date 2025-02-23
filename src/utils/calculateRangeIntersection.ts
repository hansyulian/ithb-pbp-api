type Range = {
  start: number;
  end: number;
};

export function calculateRangeIntersection(a: Range, b: Range) {
  const aStart = a.start;
  const aEnd = a.end;
  const bStart = b.start;
  const bEnd = b.end;
  const maximumStart = Math.max(aStart, bStart);
  const minimumEnd = Math.min(aEnd, bEnd);
  const result = minimumEnd - maximumStart;
  if (result < 0) {
    return 0;
  }
  return result;
}
