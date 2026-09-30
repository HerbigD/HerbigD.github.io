import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getAllWriting, makeExcerpt } from '../lib/posts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 所有 markdown 的编译结果（HTML），用来在 RSS 里放全文
const mdModules = import.meta.glob<{ compiledContent: () => string | Promise<string> }>(
  '../content/**/*.md',
  { eager: true },
);

/** 取一篇文章的全文 HTML：去掉注释，把 /image/... 这类站内路径改成完整网址（阅读器里才能显示图片） */
async function fullHtml(collection: string, id: string, site: string): Promise<string> {
  const mod = mdModules[`../content/${collection}/${id}`];
  if (!mod) return '';
  const html = await mod.compiledContent();
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(src|href)="\/(?!\/)/g, `$1="${site}/`)
    .replace(/]]>/g, ']]&gt;')
    .trim();
}

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  // thoughts + diary + belongings，按时间倒序合在一起
  const writing = (await getAllWriting()).map(w => ({
    title: w.title, url: w.url, date: w.date, section: w.section as string, excerpt: w.excerpt,
    collection: w.entry.collection as string, id: w.entry.id,
  }));
  const belongings = (await getCollection('belongings'))
    .filter(b => !b.data.draft)
    .map(b => ({
      title: b.data.title,
      url: `/belongings/${b.slug}/`,
      date: b.data.date,
      section: 'belongings',
      excerpt: b.data.excerpt ?? b.data.description ?? makeExcerpt(b.body),
      collection: 'belongings',
      id: b.id,
    }));
  const all = [...writing, ...belongings]
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 30);

  const items = (await Promise.all(all.map(async w => {
    const content = await fullHtml(w.collection, w.id, site);
    return `
    <item>
      <title>${esc(w.title)}</title>
      <link>${site}${w.url}</link>
      <guid>${site}${w.url}</guid>
      <pubDate>${w.date.toUTCString()}</pubDate>
      <category>${w.section}</category>
      <description>${esc(w.excerpt)}</description>${content ? `
      <content:encoded><![CDATA[${content}]]></content:encoded>` : ''}
    </item>`;
  }))).join('');

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
