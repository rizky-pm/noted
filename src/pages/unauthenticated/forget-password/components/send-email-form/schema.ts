import { z } from 'zod';

export const sendEmailFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email({ message: 'Invalid email adrress' }),
});

export type TypeSendEmailFormSchema = z.infer<typeof sendEmailFormSchema>;
