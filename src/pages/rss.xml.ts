import type { APIContext } from 'astro';
import { getAllWriting } from '../lib/posts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const items = (await getAllWriting()).slice(0, 30).map(w => `
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
