import { Op } from "sequelize";
import { UserNotFoundException } from "~/exceptions/NotFoundExceptions";
import { User } from "~/models/User";

export async function findUserByEmail(email: string): Promise<User>;
export async function findUserByEmail(
  email: string,
  nulling: boolean
): Promise<User | null>;
export async function findUserByEmail(email: string, nulling = false) {
  const user = await User.findOne({
    where: {
      email: {
        [Op.iRegexp]: `^${email}$`,
      },
    },
  });
  if (!user && !nulling) {
    throw new UserNotFoundException({ email });
  }
  return user;
}
