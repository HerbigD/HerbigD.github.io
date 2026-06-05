import { z, defineCollection } from 'astro:content';

const basePost = {
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
};

const musings = defineCollection({
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
    type: z.enum(['book', 'film', 'music', 'podcast']),
    rating: z.number().min(1).max(5).optional(),
    cover: z.string().optional(),
    author: z.string().optional(),
    director: z.string().optional(),
  }),
});

const life = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    category: z.enum(['tennis', 'fitness', 'diet', 'diary','other']).default('other'),
  }),
});

export const collections = {
  musings,
  'collection': media,
  life,
};
