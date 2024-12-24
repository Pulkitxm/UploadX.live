export async function hashPassword(password: string): Promise<string> {
  return password;
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return password === hash;
}
