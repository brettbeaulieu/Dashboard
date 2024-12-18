import { db } from '@/schema'
import { eq } from 'drizzle-orm';
import { users } from '@/schema';
import bcrypt from 'bcryptjs';

export const getUserFromDb = async (email: string, password: string) => {

    console.log("Email: ", email)
    console.log("Password: ", password)

    // Fetch the user by email
    const matching_users = await db.select().from(users).where(eq(users.email, email))

    // technically a list, get the one value
    const user = matching_users[0]


    console.log("User found: ", user)

    // Check if the user exists and verify the password
    if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.pass || '');
        if (isPasswordValid) {
            return { id: String(user.id), name: user.name, email: user.email }; // Exclude password
        }
    }

    return null; // Return null if user not found or password mismatch

};
