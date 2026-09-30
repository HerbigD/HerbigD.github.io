import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getAllWriting, makeExcerpt } from '../lib/posts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  // thoughts + diary + belongings，按时间倒序合在一起
  const writing = (await getAllWriting()).map(w => ({
    title: w.title, url: w.url, date: w.date, section: w.section, excerpt: w.excerpt,
  }));
  const belongings = (await getCollection('belongings'))
    .filter(b => !b.data.draft)
    .map(b => ({
      title: b.data.title,
      url: `/belongings/${b.slug}/`,
      date: b.data.date,
      section: 'belongings',
      excerpt: b.data.excerpt ?? b.data.description ?? makeExcerpt(b.body),
    }));
  const all = [...writing, ...belongings].sort((a, b) => b.date.valueOf() - a.date.valueOf());

  const items = all.slice(0, 30).map(w => `
    <item>
      <title>${esc(w.title)}</title>
      <link>${site}${w.url}</link>
      <guid>${site}${w.url}</guid>
      <pubDate>${w.date.toUTCString()}</pubDate>
      <category>${w.section}</category>
      <description>${esc(w.excerpt)}</description>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>头大的D</title>
    <link>${site}/</link>
    <description>现实太闷，到梦境旅行。</description>
    <language>zh-CN</language>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
