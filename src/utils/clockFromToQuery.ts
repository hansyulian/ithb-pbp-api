export function clockFromToQuery(from: Date, to: Date) {
  return {
    start: { $lte: to },
    $or: [
      { end: { $gte: from } },
      { end: null }, // Matches both `null` and undefined values in MongoDB
    ],
  };
}
