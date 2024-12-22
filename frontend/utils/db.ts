import { db, users } from '@/schema'
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const getUserFromDb = async (email: string, password: string) => {
    // Fetch the user by email
    const matchingUsers = await db.select().from(users).where(eq(users.email, email))

    // technically a list, get the one value
    const user = matchingUsers[0]

    // Check if the user exists and verify the password
    if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.pass ?? '');
        if (isPasswordValid) {
            // Exclude password from returned user object
            return { id: String(user.id), name: user.name, email: user.email };
        }
    }

    // Return null if user not found
    return null;

};
