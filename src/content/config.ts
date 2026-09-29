import { z, defineCollection } from 'astro:content';

const basePost = {
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  /** 可选：自定义首页摘要；不写则自动截取正文开头 */
  excerpt: z.string().optional(),
  draft: z.boolean().default(false),
};

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    mood: z.string().optional(),
  }),
});

const belongings = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    cover: z.string().optional(),
  }),
});

const diary = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    category: z.enum(['tennis', 'fitness', 'diet', 'diary', 'other']).default('other'),
  }),
});

export const collections = {
  thoughts,
  belongings,
  diary,
};
