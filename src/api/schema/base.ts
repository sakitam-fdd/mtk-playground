import { z } from 'zod';

export const res = z.object({
  code: z.number().describe('状态码'),
  msg: z.string().describe('接口操作信息'),
});
