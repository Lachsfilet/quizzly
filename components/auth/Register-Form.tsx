'use client'
import * as z from 'zod'
import { CardWrapper } from '@/components/auth/Card-Wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { RegisterSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { register } from '@/actions/auth/register'
import { useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          toast.error(data.error)
        }
        if (data?.success) {
          toast.success(data.success)
          form.reset({ email: '', password: '', name: '' })
        }
      })
    })
  }

  return (
    <CardWrapper
      headerTitle="Register"
      showSocial
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isPending}
                      type="name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@gmail.com"
                      disabled={isPending}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                    <Input
                      placeholder="••••••••"
                      {...field}
                      disabled={isPending}
                      type="password"
                      className="text-2xl"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="p-[3px] bg-transparent relative font-semibold w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-end rounded-[7.5px] w-full" />
            <div className="px-8 py-2 w-full bg-black/50 backdrop-blur-4xl hover:backdrop-blur-none rounded-[5px] relative group transition duration-200 text-white hover:bg-transparent text-lg">
              Register
            </div>
          </button>
        </form>
      </Form>
    </CardWrapper>
  )
}
