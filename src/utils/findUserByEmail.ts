import { UserNotFoundException } from "~/exceptions/NotFoundExceptions";
import { User } from "~/models/User";
import { queryParser } from "~/utils/queryParser";

export async function findUserByEmail(email: string): Promise<User>;
export async function findUserByEmail(
  email: string,
  nulling: boolean
): Promise<User | null>;
export async function findUserByEmail(email: string, nulling = false) {
  const user = await User.findOne({
    where: {
      email: queryParser.stringLike(email),
    },
  });
  if (!user && !nulling) {
    throw new UserNotFoundException({ email });
  }
  return user;
}
