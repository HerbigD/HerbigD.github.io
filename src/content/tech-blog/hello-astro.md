---
title: 网站重建：从 Hexo 到 Astro
date: 2026-03-19
description: 用 Astro 重建个人网站的过程记录
tags: [Astro, 建站]
---

这是技术 Blog 的第一篇文章，记录一下用 Astro 重建个人网站的过程。

## 为什么换框架

原来的博客用的是 Hexo + Fluid 主题，功能挺好的，但自定义空间有限。换成 Astro 之后，CSS 和页面结构都可以完全自己掌控。

## Astro 的核心概念

Astro 是一个静态站点生成器，支持 Content Collections 来管理 Markdown 内容。每个板块（技术 Blog、胡思乱想等）都是一个 Collection，有自己的 schema 校验。

写文章的流程很简单：

1. 在 `src/content/tech-blog/` 下新建一个 `.md` 文件
2. 写好 frontmatter（标题、日期等）
3. git push → GitHub Actions 自动构建并发布
