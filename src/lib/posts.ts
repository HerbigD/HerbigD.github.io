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
  /** 保留换行的摘要：段落 → 行 */
  excerptParas: string[][];
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

/**
 * 保留原文换行/分段的摘要，和正文页的排版一致。
 * 返回 段落[行[]]；超过 maxChars 字或 maxLines 行就截断并加"……"。
 * 换行规则同 markdown：行尾两个空格（或 \\、<br>）是换行，空行是分段。
 */
export function excerptParagraphs(body: string, maxChars = 120, maxLines = 6): string[][] {
  const cleaned = body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '  \n')
    .replace(/<[^>]+>/g, '')                  // html 标签（含 <img>）
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')     // 图片
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1');  // 链接保留文字

  const paras: string[][] = [];
  for (const block of cleaned.split(/\n[ \t]*\n/)) {
    const lines: string[] = [];
    let cur = '';
    for (const raw of block.split('\n')) {
      if (/^\s*[-*_]{3,}\s*$/.test(raw)) continue;          // 分隔线
      const isBlock = /^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/.test(raw); // 标题/引用/列表单独成行
      const hard = / {2,}$|\\$/.test(raw);
      const t = raw
        .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/, '')
        .replace(/\\$/, '')
        .replace(/[*_`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (isBlock && cur) { lines.push(cur); cur = ''; }
      if (t) cur = cur ? `${cur} ${t}` : t;
      if ((hard || isBlock) && cur) { lines.push(cur); cur = ''; }
    }
    if (cur) lines.push(cur);
    if (lines.length) paras.push(lines);
  }

  const out: string[][] = [];
  let chars = 0, count = 0, truncated = false;
  outer: for (const para of paras) {
    const np: string[] = [];
    for (const line of para) {
      if (chars >= maxChars || count >= maxLines) { truncated = true; break; }
      const remain = maxChars - chars;
      if (line.length > remain) {
        np.push(line.slice(0, remain).replace(/[，。、；：,.;:\s]+$/, '') + '……');
        out.push(np);
        return out;
      }
      np.push(line); chars += line.length; count++;
    }
    if (np.length) out.push(np);
    if (truncated) break outer;
  }
  if (truncated && out.length) {
    const last = out[out.length - 1];
    last[last.length - 1] = last[last.length - 1].replace(/[，。、；：,.;:\s]+$/, '') + '……';
  }
  return out;
}

/** frontmatter 里手写的 excerpt 也按换行/空行拆开 */
export function splitExcerpt(text: string): string[][] {
  return text.split(/\n[ \t]*\n/)
    .map(p => p.split('\n').map(l => l.trim()).filter(Boolean))
    .filter(p => p.length);
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
    excerptParas: entry.data.excerpt ? splitExcerpt(entry.data.excerpt) : excerptParagraphs(entry.body),
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
