import { z } from 'zod';

export const changePasswordFormSchema = z
  .object({
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

export type TypeChangePasswordFormSchema = z.infer<
  typeof changePasswordFormSchema
>;
