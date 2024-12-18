import { users, db } from '../schema';
import { saltAndHashPassword } from './password';


async function main() {
    const password = saltAndHashPassword('testexample')
    const user: typeof users.$inferInsert = {
      name: 'Test Example',
      email: 'test@example.com',
      pass: password,
    };
    await db.insert(users).values(user);
}
main()