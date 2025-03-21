import { z } from 'zod';

export const filtersSchema = z.object({
  sortBy: z.enum(['a-to-z', 'z-to-a', 'latest', 'oldest'], {
    required_error: 'Sort option required.',
  }),
});

export type TypeFiltersSchema = z.infer<typeof filtersSchema>;
