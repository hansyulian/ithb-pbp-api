import { Op } from "sequelize";

export const queryParser = {
  stringLike,
};

function stringLike(value: string | number | undefined) {
  if (value === undefined) {
    return undefined;
  }
  return { [Op.iLike]: `%${value}%` };
}
