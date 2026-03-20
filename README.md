# 个人网站使用说明

## 目录

- [项目结构](#项目结构)
- [本地预览](#本地预览)
- [写新文章](#写新文章)
- [发布到线上](#发布到线上)
- [修改首页自我介绍](#修改首页自我介绍)
- [修改导航栏](#修改导航栏)
- [修改颜色和字体](#修改颜色和字体)
- [修改页面布局](#修改页面布局)
- [常见操作速查](#常见操作速查)

---

## 项目结构

```
blog/
├── src/
│   ├── content/          ← 你的所有文章都放这里
│   │   ├── tech-blog/    ← 技术 Blog
│   │   ├── musings/      ← 胡思乱想
│   │   ├── media/        ← 书/影/音/哲学
│   │   ├── life/         ← 生活记录
│   │   └── projects/     ← Projects
│   ├── pages/            ← 每个板块的列表页和文章页
│   ├── layouts/          ← 页面外壳（导航+页脚）
│   ├── components/       ← 可复用的小组件
│   └── styles/
│       └── global.css    ← 所有样式和颜色变量（改色改这里）
├── public/               ← 静态资源（图片、favicon）
├── astro.config.mjs      ← Astro 配置
└── .github/workflows/
    └── deploy.yml        ← 自动部署配置
```

---

## 本地预览

在写文章或修改样式时，建议先在本地预览效果。

```bash
# 进入项目目录
cd /Users/dongriririhan/blog

# 启动本地服务器
npm run dev
```

打开浏览器访问 `http://localhost:4321`，保存文件后页面会自动刷新。


---

## 写新文章

### 通用规则

每篇文章都是一个 `.md` 文件，放在对应板块的 `src/content/` 子目录下。

**文件名即 URL**，例如：
- 文件：`src/content/tech-blog/react-hooks.md`
- 访问地址：`https://HerbigD.github.io/tech-blog/react-hooks`

文件名建议用英文或拼音，不要用中文（避免 URL 乱码）。

---

### 技术 Blog

**文件位置：** `src/content/tech-blog/文件名.md`

```markdown
---
title: 我学会了 React Hooks
date: 2026-04-01
description: useState 和 useEffect 的基本用法（可选，列表页显示）
tags: [React, 前端]
draft: false
---

正文从这里开始，支持完整的 Markdown 语法。

## 二级标题

这是一段普通文字。

\`\`\`javascript
// 代码块
const [count, setCount] = useState(0);
\`\`\`
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 格式：`YYYY-MM-DD` |
| `description` | 可选 | 列表页的摘要说明 |
| `tags` | 可选 | 标签数组，如 `[React, 前端]` |
| `draft` | 可选 | `true` = 草稿，不显示；默认 `false` |

---

### 胡思乱想

**文件位置：** `src/content/musings/文件名.md`

```markdown
---
title: 关于拖延症的一点思考
date: 2026-04-01
description: 可选
mood: 焦虑
draft: false
---

正文...
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 标题 |
| `date` | ✅ | 日期 |
| `description` | 可选 | 摘要 |
| `mood` | 可选 | 心情标签，随便写 |
| `draft` | 可选 | 草稿开关 |

---

### 书 / 影 / 音 / 哲学

**文件位置：** `src/content/media/文件名.md`

```markdown
---
title: 《百年孤独》
date: 2026-04-01
type: book
author: 加西亚·马尔克斯
rating: 5
description: 魔幻现实主义的巅峰
draft: false
---

读后感正文...
```

```markdown
---
title: 《请回答1988》
date: 2026-04-01
type: film
director: 申源浩
rating: 5
description: 关于那个年代的温柔记忆
---

影评正文...
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 书名/片名/专辑名 |
| `date` | ✅ | 日期 |
| `type` | ✅ | 只能填：`book` / `film` / `music` / `philosophy` |
| `rating` | 可选 | 1-5 的整数，显示星星 |
| `author` | 可选 | 作者（书用） |
| `director` | 可选 | 导演（影用） |
| `description` | 可选 | 摘要 |
| `draft` | 可选 | 草稿开关 |

---

### 生活记录

**文件位置：** `src/content/life/文件名.md`

```markdown
---
title: 今天打了两小时网球
date: 2026-04-01
category: tennis
description: 反手切片终于有感觉了
draft: false
---

正文...
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 标题 |
| `date` | ✅ | 日期 |
| `category` | 可选 | `tennis` / `fitness` / `diet` / `other` |
| `description` | 可选 | 摘要 |
| `draft` | 可选 | 草稿开关 |

---

### Projects

**文件位置：** `src/content/projects/文件名.md`

```markdown
---
title: 一个有趣的小工具
description: 用 Python 写的自动整理桌面文件的脚本
date: 2026-04-01
tech: [Python, Shell]
github: https://github.com/HerbigD/xxx
url: https://example.com
status: completed
---

项目详细介绍...
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 项目名 |
| `description` | ✅ | 简短描述（显示在卡片上） |
| `date` | ✅ | 日期 |
| `tech` | 可选 | 技术栈数组 |
| `github` | 可选 | GitHub 链接 |
| `url` | 可选 | 线上地址 |
| `status` | 可选 | `active`（进行中）/ `completed`（完成）/ `archived`（归档） |

---

## 发布到线上

写完文章后，执行以下三条命令即可发布：

```bash
git add .
git commit -m "新增：文章标题"
git push
```

推送后 GitHub Actions 自动构建，约 **60 秒**后 `https://HerbigD.github.io` 更新。

可以在 GitHub 仓库的 **Actions** 标签页查看构建进度。

### 保存草稿（不发布）

在文章 frontmatter 里加上 `draft: true`，该文章不会出现在网站上，但文件会正常同步到 GitHub。

---

## 修改首页自我介绍

打开文件：`src/pages/index.astro`

找到这段文字，直接修改：

```astro
<div class="bio">
  <p>
    你好，我是 D。目前在做一些有趣的探索——关于技术、思维，还有如何在这个快速变化的世界里慢慢生活。
  </p>
  <p>
    这个网站是我的数字花园，记录学习的轨迹、随意的想法、喜欢的东西，以及日复一日的生活。
  </p>
</div>
```

把两段 `<p>` 里的文字换成自己的介绍即可。

---

## 修改导航栏

打开文件：`src/components/Nav.astro`

导航链接在这里定义：

```js
const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/tech-blog', label: '技术Blog' },
  { href: '/musings', label: '胡思乱想' },
  { href: '/media', label: '书影音' },
  { href: '/life', label: '生活' },
];
```

- **修改显示名称**：改 `label` 字段
- **调整顺序**：调换数组里的行顺序
- 左上角的 logo `D` 在 `<a href="/" class="nav-logo">D</a>` 这行，可以改成你想要的字

---

## 修改颜色和字体

**所有颜色和字体都在一个文件里集中管理：**

打开文件：`src/styles/global.css`，找到最顶部的 `:root { }` 区块：

```css
:root {
  /* ── 颜色 ── */
  --color-bg:          #F7F5F0;   /* 页面背景色（暖白） */
  --color-surface:     #EFEDE8;   /* 卡片/区块背景 */
  --color-border:      #E0DDD6;   /* 分割线颜色 */
  --color-text:        #2C2C2C;   /* 主文字颜色（炭灰） */
  --color-text-muted:  #7A7670;   /* 次要文字（日期、标签） */
  --color-accent:      #7A9E7E;   /* 点缀色（鼠尾草绿） */
  --color-accent-dark: #5C7D60;   /* 点缀色深色（hover 状态） */

  /* ── 字体 ── */
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* ── 内容宽度 ── */
  --content-width: 720px;
}
```

### 换点缀色示例

| 风格 | `--color-accent` | `--color-accent-dark` |
|---|---|---|
| 鼠尾草绿（当前） | `#7A9E7E` | `#5C7D60` |
| 砖红 | `#C4785A` | `#A35C40` |
| 深蓝 | `#5B7FA6` | `#3E6088` |
| 暖棕 | `#A8845C` | `#8A6840` |
| 薰衣草紫 | `#9B8EC4` | `#7B6EAA` |

只需修改这两行，整个网站的点缀色（链接 hover、卡片边框、星星评分等）全部同步更新。

### 换深色模式

把背景和文字颜色对调：

```css
--color-bg:      #1a1a1a;
--color-surface: #242424;
--color-border:  #333333;
--color-text:    #e8e6e0;
--color-text-muted: #888480;
```

---

## 修改页面布局

### 修改某个板块的列表页

例如修改「胡思乱想」列表页的标题和说明：

打开 `src/pages/musings/index.astro`，找到：

```astro
<div class="page-header">
  <h1>胡思乱想</h1>
  <p>一些零散的思考，想到什么写什么</p>
</div>
```

直接改文字即可。

### 修改文章页的样式

文章页的样式在 `src/styles/global.css` 的 `/* PROSE */` 区块，控制正文的标题、段落、代码块、引用等样式：

```css
.prose h2 { font-size: 1.25rem; }   /* 文章内二级标题大小 */
.prose p   { margin-bottom: 1rem; } /* 段落间距 */
.prose blockquote { ... }            /* 引用块样式 */
.prose code { ... }                  /* 行内代码样式 */
```

### 修改内容宽度

在 `global.css` 顶部改：

```css
--content-width: 720px;  /* 改成 800px 变宽，改成 600px 变窄 */
```

### 修改导航栏高度

```css
--nav-height: 56px;  /* 改大改小都行 */
```

### 给 Project 卡片改网格列数

打开 `src/styles/global.css`，找到：

```css
.project-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

把 `280px` 改大（如 `360px`）就会每行显示更少列，改小则更多列。

---

## 常见操作速查

| 我想做什么 | 操作 |
|---|---|
| 写一篇技术博客 | 在 `src/content/tech-blog/` 新建 `.md` 文件 |
| 写一篇胡思乱想 | 在 `src/content/musings/` 新建 `.md` 文件 |
| 记录一本书/电影 | 在 `src/content/media/` 新建 `.md` 文件，设置 `type` |
| 写生活记录 | 在 `src/content/life/` 新建 `.md` 文件 |
| 添加一个 project | 在 `src/content/projects/` 新建 `.md` 文件 |
| 先存草稿不发布 | 在文章 frontmatter 加 `draft: true` |
| 发布到线上 | `git add . && git commit -m "说明" && git push` |
| 本地预览效果 | `npm run dev`，访问 localhost:4321 |
| 改点缀颜色 | 改 `global.css` 里的 `--color-accent` |
| 改首页介绍文字 | 改 `src/pages/index.astro` |
| 改导航栏链接名 | 改 `src/components/Nav.astro` |
| 改文章页样式 | 改 `global.css` 里的 `.prose` 区块 |
| 查看部署进度 | GitHub 仓库 → Actions 标签页 |
