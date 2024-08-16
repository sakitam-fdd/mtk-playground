import { z } from 'zod';
import { res } from './base';

const item = z.object({
  id: z.string().or(z.number()),
  label: z.string(),
  desc: z.string(),
});

export const template = res.extend({
  data: z.object({
    tags: z.array(item),
  }),
});

export type ITemplate = z.infer<typeof template>;
