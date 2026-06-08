import { z, defineCollection } from 'astro:content';

const basePost = {
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
};

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    mood: z.string().optional(),
  }),
});

const media = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    type: z.enum(['book', 'film', 'music', 'item']),
    rating: z.number().min(1).max(5).optional(),
    cover: z.string().optional(),
    author: z.string().optional(),
    director: z.string().optional(),
    status: z.enum(['completed', 'ongoing']).optional(),
    currentPage: z.number().optional(),
    playMode: z.string().optional(),
    watchCount: z.number().optional(),
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
  'collection': media,
  diary,
};
