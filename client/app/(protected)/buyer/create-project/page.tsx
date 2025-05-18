"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { asCreateProject } from "@/redux/action/projectAction"

const formSchema = z
  .object({
    title: z.string().min(5, { message: "Title must be at least 5 characters" }),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }),
    budgetMin: z.coerce.number().positive({ message: "Budget must be a positive number" }),
    budgetMax: z.coerce.number().positive({ message: "Budget must be a positive number" }),
    deadline: z.string().refine((date) => new Date(date) > new Date(), {
      message: "Deadline must be in the future",
    }),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  })

type FormValues = z.infer<typeof formSchema>

export default function CreateProjectPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      budgetMin: 0,
      budgetMax: 0,
      deadline: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const resultAction = await dispatch(asCreateProject(data) as any)

      if(resultAction) router.push("/buyer/dashboard")
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  // Set minimum date for deadline (today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = today.toISOString().split("T")[0]

  return (
    <div className="container py-10 mx-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
          <CardDescription>
            Fill in the details below to post your project and start receiving bids from sellers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Website Redesign" {...field} />
                    </FormControl>
                    <FormDescription>A clear, concise title that describes your project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project requirements, goals, and any specific details sellers should know..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your project to help sellers understand your needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Budget ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormDescription>The minimum amount you're willing to pay.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Budget ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormDescription>The maximum amount you're willing to pay.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" min={minDate} {...field} />
                    </FormControl>
                    <FormDescription>The date by which you need the project to be completed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
