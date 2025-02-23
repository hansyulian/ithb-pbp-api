// minimum 12
// should have an uppercase letter
// should have a lowercase letter
// sould have number
// should have some special characters
const regex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;

export function verifyPasswordCharacters(value: string) {
  return regex.test(value);
}
