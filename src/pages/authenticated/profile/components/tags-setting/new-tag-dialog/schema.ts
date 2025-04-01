import { z } from 'zod';

export const createNewTagSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Tag can't be empty",
    })
    .max(25, {
      message: 'Max character 25 is reached',
    }),
  color: z.enum(['red', 'yellow', 'green', 'blue'], {
    required_error: 'Please select your tag color',
  }),
});

export type TypeCreateNewTagSchema = z.infer<typeof createNewTagSchema>;
