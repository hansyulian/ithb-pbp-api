export const queryParser = {
  stringLike,
  inArray,
  range,
};

function stringLike(value: string | number | undefined) {
  if (value === undefined) {
    return undefined;
  }
  return { $regex: value, $options: "i" };
}

function inArray(value: string[] | number[] | undefined) {
  if (value === undefined) {
    return undefined;
  }
  return { $in: value };
}

function range(min: number | undefined, max: number | undefined) {
  if (min === undefined && max === undefined) {
    return;
  }
  const result: any = {};
  if (min) {
    result.$gte = min;
  }
  if (max) {
    result.$lte = max;
  }
  return result;
}
