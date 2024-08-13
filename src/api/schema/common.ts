import { z } from 'zod';
import { res } from './base';

const enumItem = z.object({
  id: z.string().or(z.number()),
  label: z.string(),
  desc: z.string(),
});

export const commonEnum = res.extend({
  data: z.object({
    tags: z.array(enumItem),
  }),
});

export type CommonEnumType = z.infer<typeof commonEnum>;
