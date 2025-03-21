import { z } from 'zod';

export const searchSchema = z.object({
  searchTerm: z.string().min(1, { message: 'Search term is required' }),
});

export type TypeSearchSchema = z.infer<typeof searchSchema>;
