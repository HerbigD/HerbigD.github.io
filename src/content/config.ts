import { z, defineCollection } from 'astro:content';

const basePost = {
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
};

const techBlog = defineCollection({
  type: 'content',
  schema: z.object({
    ...basePost,
    tags: z.array(z.string()).default([]),
  }),
});

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
    type: z.enum(['book', 'film', 'music', 'philosophy']),
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
    category: z.enum(['tennis', 'fitness', 'diet', 'other']).default('other'),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tech: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    github: z.string().url().optional(),
    status: z.enum(['active', 'completed', 'archived']).default('completed'),
    image: z.string().optional(),
  }),
});

export const collections = {
  'tech-blog': techBlog,
  musings,
  media,
  life,
  projects,
};
