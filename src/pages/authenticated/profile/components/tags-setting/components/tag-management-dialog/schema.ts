import { z } from 'zod';

export const createNewTagSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Tag name is required',
    })
    .max(25, {
      message: 'Max character 25 is reached',
    }),
  color: z.enum(['red', 'yellow', 'green', 'blue', 'purple', 'gray'], {
    required_error: 'Please select your tag color',
  }),
});

export type TypeCreateNewTagSchema = z.infer<typeof createNewTagSchema>;
