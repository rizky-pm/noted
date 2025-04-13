import { z } from 'zod';

export const createNewNoteSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title can't be empty.",
    })
    .max(25, {
      message: 'Max character 25 is reached.',
    }),
  tag: z.string().min(1, {
    message: 'Please select tag.',
  }),
  content: z
    .string()
    .min(1, {
      message: "Note can't be empty.",
    })
    .max(500, {
      message: 'Max character 500 is reached.',
    }),
});

export type TypeCreateNewNoteSchema = z.infer<typeof createNewNoteSchema>;
