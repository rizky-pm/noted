import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, {
      message: "Old password can't be empty",
    }),
    newPassword: z.string().min(1, {
      message: "New password can't be empty",
    }),
    confirmNewPassword: z.string().min(1, {
      message: "Confirm new password can't be empty",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password must match',
    path: ['confirmNewPassword'],
  });

export type TypeChangePasswordSchema = z.infer<typeof changePasswordSchema>;
