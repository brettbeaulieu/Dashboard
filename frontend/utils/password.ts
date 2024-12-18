import bcrypt from 'bcryptjs';

export const saltAndHashPassword = (password: string): string => {
  const saltRounds = 10; // Adjust the salt rounds as needed
  return bcrypt.hashSync(password, saltRounds);
};