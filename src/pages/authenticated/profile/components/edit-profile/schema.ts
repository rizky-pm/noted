import { z } from 'zod';

export const editProfileSchema = z.object({
  username: z.string().min(1, {
    message: "Username can't be empty",
  }),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size < 512 * 1024, {
      message: 'Image must be less than 512Kb.',
    })
    .nullable(),
});

export type TypeEditProfileSchema = z.infer<typeof editProfileSchema>;
