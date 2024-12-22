'use client'
import { signIn } from 'next-auth/react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { signInSchema } from '@/lib/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'



export const SignIn = (props: { callbackUrl: string | undefined }
) => {

  const [showPW, setShowPW] = useState<boolean>(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const credentialsAction = async (values: z.infer<typeof signInSchema>) => {

    const { email, password } = values

    // sign in the user; returns promise
    await signIn('credentials', {
      email,
      password,
      redirectTo: props.callbackUrl,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(credentialsAction)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="myemail@domain.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='flex flex-row'>
                      <Input placeholder='●●●●●●●●●' {...field} type={showPW ? 'text' : 'password'} />
                      <Button type='button' onClick={() => setShowPW(!showPW)} className="ml-2" variant={"outline"}>
                        {showPW ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Password
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>

  )
}