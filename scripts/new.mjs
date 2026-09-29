#!/usr/bin/env node
// 新建一篇文章：
//   npm run new -- "标题"              → src/content/thoughts/<slug>.md
//   npm run new -- diary "标题"        → src/content/diary/<slug>.md
//   npm run new -- "标题" --slug=abc   → 指定文件名 / 网址
import { existsSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const rest = args.filter(a => !a.startsWith('--'));
const section = ['thoughts', 'diary'].includes(rest[0]) ? rest.shift() : 'thoughts';
const title = rest.join(' ').trim();
if (!title) {
  console.error('用法：npm run new -- [thoughts|diary] "标题" [--slug=xxx]');
  process.exit(1);
}

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const ascii = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const slug = flags.slug || ascii || date;

let file = `src/content/${section}/${slug}.md`;
for (let i = 2; existsSync(file); i++) file = `src/content/${section}/${slug}-${i}.md`;

writeFileSync(file, `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
draft: true
---

`);
console.log(`已创建 ${file}（draft: true，写完后删掉这一行即可发布）`);
