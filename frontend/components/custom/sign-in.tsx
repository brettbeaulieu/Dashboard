"use client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"



export const SignIn = (props: { callbackUrl: string | undefined }
) => {

  const router = useRouter()

  const credentialsAction = async (formData: FormData) => {

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    
    // sign in the user; returns promise
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo : props.callbackUrl,
    })
    console.log("email: ", email, " password: ", password, "props.callbackUrl: ", props.callbackUrl)
    console.log("result: ", result)
    if (!result?.ok) {
      throw new Error("Authentication failed.")
    }
    // if sign-in successful, redirect
    router.push("/dashboard")




  }
 
  return (
    <form action={credentialsAction}>
      <label htmlFor="credentials-email">
        Email
        <input type="email" id="credentials-email" name="email" />
      </label>
      <label htmlFor="credentials-password">
        Password
        <input type="password" id="credentials-password" name="password" />
      </label>
      <input type="submit" value="Sign In" />
    </form>
  )
}