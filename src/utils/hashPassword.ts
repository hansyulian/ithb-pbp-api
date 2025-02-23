import bcrypt from "bcrypt";

export async function hashPassword(value: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(value, salt);
}
