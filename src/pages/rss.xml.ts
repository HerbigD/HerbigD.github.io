import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getAllWriting, makeExcerpt } from '../lib/posts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  // thoughts + diary + belongings，按时间倒序合在一起
  const writing = (await getAllWriting()).map(w => ({
    title: w.title, url: w.url, date: w.date, section: w.section as string, excerpt: w.excerpt,
  }));
  const belongings = (await getCollection('belongings'))
    .filter(b => !b.data.draft)
    .map(b => ({
      title: b.data.title,
      url: `/belongings/${b.slug}/`,
      date: b.data.date,
      section: 'belongings',
      excerpt: b.data.excerpt ?? makeExcerpt(b.body.replace(/<!--[\s\S]*?-->/g, '')),
    }));
  const all = [...writing, ...belongings]
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 30);

  // 阅读器里只显示摘要，下面放一个 READ MORE 跳回网站
  const items = all.map(w => {
    const link = `${site}${w.url}`;
    const content = `<p>${esc(w.excerpt)}</p>\n<p><a href="${link}">READ MORE</a></p>`;
    return `
    <item>
      <title>${esc(w.title)}</title>
      <link>${site}${w.url}</link>
      <guid>${site}${w.url}</guid>
      <pubDate>${w.date.toUTCString()}</pubDate>
      <category>${w.section}</category>
      <description>${esc(w.excerpt)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>头大的D</title>
    <link>${site}/</link>
    <description>现实太闷，到梦境旅行。</description>
    <language>zh-CN</language>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
