import { getCollection, type CollectionEntry } from 'astro:content';

export type Section = 'thoughts' | 'diary';
export type WritingEntry = CollectionEntry<'thoughts'> | CollectionEntry<'diary'>;

export interface Writing {
  entry: WritingEntry;
  section: Section;
  url: string;
  title: string;
  date: Date;
  excerpt: string;
  minutes: number;
}

export const sectionLabel: Record<Section, string> = {
  thoughts: 'thoughts',
  diary: 'diary',
};

/** 把 markdown / html 正文压成纯文本，用来生成摘要和估算阅读时长 */
export function plainText(body: string): string {
  return body
    .replace(/<[^>]+>/g, ' ')                 // html 标签（含 <img>）
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')     // 图片
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')   // 链接保留文字
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // 标题/引用/列表记号
    .replace(/^[-*_]{3,}\s*$/gm, ' ')         // 分隔线
    .replace(/[*_`~]/g, '')                   // 强调、代码
    .replace(/\s+/g, ' ')
    // 中文之间换行产生的空格去掉
    .replace(/([\u3000-\u303f\u4e00-\u9fff\uff00-\uffef])\s+(?=[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef])/g, '$1')
    .trim();
}

export function makeExcerpt(body: string, max = 120): string {
  const text = plainText(body);
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/[，。、；：,.;:\s]+$/, '') + '……';
}

/** 中文按 400 字/分钟，英文按 220 词/分钟粗略估算 */
export function readingMinutes(body: string): number {
  const text = plainText(body);
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const words = text.replace(/[一-鿿]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
}

/** 早于这个日期的文章不在网站上显示（原文件保留）。想恢复就改成 null */
export const HIDE_BEFORE: Date | null = new Date('2026-01-01');

const isPublished = (e: WritingEntry) =>
  !e.data.draft &&
  e.body.trim().length > 0 &&
  (!HIDE_BEFORE || e.data.date >= HIDE_BEFORE);

/** 所有公开文字（thoughts + diary），按时间倒序 */
export async function getAllWriting(): Promise<Writing[]> {
  const [thoughts, diary] = await Promise.all([
    getCollection('thoughts'),
    getCollection('diary'),
  ]);
  const wrap = (section: Section) => (entry: WritingEntry): Writing => ({
    entry,
    section,
    url: `/${section}/${entry.slug}/`,
    title: entry.data.title,
    date: entry.data.date,
    excerpt: entry.data.excerpt ?? makeExcerpt(entry.body),
    minutes: readingMinutes(entry.body),
  });
  return [
    ...thoughts.filter(isPublished).map(wrap('thoughts')),
    ...diary.filter(isPublished).map(wrap('diary')),
  ].sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

/** 为文章详情页生成静态路径，附带上一篇/下一篇（跨板块，按时间线） */
export async function writingPaths(section: Section) {
  const all = await getAllWriting();
  return all
    .map((w, i) => ({ w, newer: all[i - 1], older: all[i + 1] }))
    .filter(({ w }) => w.section === section)
    .map(({ w, newer, older }) => ({
      params: { slug: w.entry.slug },
      props: { writing: w, newer, older },
    }));
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
