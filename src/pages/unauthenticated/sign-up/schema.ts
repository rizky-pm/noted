import { z } from 'zod';

export const signUpSchema = z
  .object({
    username: z.string().min(1, {
      message: 'Username is required',
    }),
    email: z
      .string()
      .email({
        message: 'Invalid email address',
      })
      .min(1, {
        message: 'Email is required',
      }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long',
    }),
    confirmPassword: z.string().min(1, {
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

export type TypeSignUpSchema = z.infer<typeof signUpSchema>;
