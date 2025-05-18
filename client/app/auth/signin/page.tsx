"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { authSignIn } from "@/redux/action/userAction"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  // role: z.enum(["buyer", "seller"], { required_error: "Please select a role" }),
})

type FormValues = z.infer<typeof formSchema>

export default function SignInPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  console.log(isLoading,"load");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      // role: "buyer",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const user = await dispatch(authSignIn(data) as any)

        // Redirect based on role
        if (user.userType === "BUYER") {
          router.push("/buyer/dashboard")
        } else {
          router.push("/seller/dashboard")
        }
    } catch (error) {
      toast.error("Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>I am a</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="buyer" />
                          </FormControl>
                          <FormLabel className="font-normal">Buyer</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="seller" />
                          </FormControl>
                          <FormLabel className="font-normal">Seller</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
