---
name: design-admin
description: >-
  构建或修改 Kapibala Web 管理后台前端时使用(React 18 + Vite + TypeScript +
  Tailwind CSS v4 + shadcn/ui + Radix)。强制本团队设计与工程标准:语义 design
  token、statusMap 状态语义色系统、i18n 文案、PermissionGate 权限门控、统一
  logger、React Query + adapter 数据层约定;并提供可直接拷入项目的 globals.css /
  statusMap.ts / eslint.config.js / components.json 等落地物。涉及管理后台 UI、
  状态徽章、design token、主题/暗色模式、白标、组件骨架(Sidebar/TopBar/⌘K)或
  上述任一规范时,务必加载本 skill。English: use when building or modifying a Kapibala
  React + Tailwind v4 + shadcn admin dashboard / admin panel UI — design tokens,
  theming and dark mode, status badges, white-label branding, i18n, permission
  gating, logging, React Query data layer, shadcn/ui components.
---

# Kapibala_Design_Admin

> Kapibala 团队 **Web 管理后台** 前端设计与工程标准。
> 技术栈基线:**React 18+ · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix**。
> 用途:本 skill 在构建管理后台前端时自动加载为 AI context(也供人工查阅)。
> `references/` 是规范分册(按需读),`assets/` 是可直接拷进项目的落地物。

本标准从团队**已上线的管理后台实战项目**提炼:以其中工程纪律最完整的一套为骨架,吸收另一套在设计哲学 / 视觉语言上的长处,并统一两者历史上的不一致(最典型:状态色)。

---

## 0. 怎么用这份标准(给 AI 的读法)

1. **本文件(`SKILL.md`)是入口**,列硬约束 + 红旗信号 + 导航。细节按需读 `references/` 分册:
   - [`principles.md`](references/principles.md) — 设计哲学 / 视觉语言(间距、阴影、圆角、玻璃拟态、AI 卡片)
   - [`tokens.md`](references/tokens.md) — Design token 全量清单 + 命名规范 + 白标
   - [`status-system.md`](references/status-system.md) — ⭐状态语义色系统(本标准最核心的差异化资产)
   - [`components.md`](references/components.md) — shadcn 原语 + 必备共享组件 + 布局骨架
   - [`conventions.md`](references/conventions.md) — 目录 / 命名 / i18n / 数据层 / 日志 / ESLint 全量规则
   - [`rationale.md`](references/rationale.md) — 取舍来由 + 历史教训(按需读,非生成时必读)
2. **`assets/` 是可直接复制进消费项目的落地物**:配置(`globals.css` / `tailwind.config.ts` / `eslint.config.js` / `components.json`)、工具与单源(`lib/cn.ts` / `lib/logger.ts` / `statusMap.ts`)、承载纪律的共享组件(`components/*.tsx` / `contexts/AuthContext.tsx`)、i18n 骨架(`i18n/locales/*.json`)。
3. 写代码前,先扫本文件 §2「十条硬约束」和 §3「红旗信号」。任何一条命中,停下来改,别 ship。

---

## 0.5 落地步骤(在消费项目里首次接入时)

把落地物从本 skill 拷进项目对应位置(skill 安装后,文件在 `${CLAUDE_SKILL_DIR}/assets/`):

| 从 `assets/` | 拷到项目 | 说明 |
|---|---|---|
| `globals.css` | `src/styles/globals.css` | Tailwind v4 `@theme` token;入口 `import` |
| `statusMap.ts` | `src/lib/statusMap.ts` | 状态色单源;按业务追加域表 |
| `lib/cn.ts` | `src/lib/cn.ts` | `cn()` className 合并 |
| `lib/logger.ts` | `src/lib/logger.ts` | 唯一 console sink;禁裸 `console.*` |
| `lib/whitelabel.ts` | `src/lib/whitelabel.ts` | 白标:`VITE_PRIMARY_COLOR` → `--brand`,`--brand-2` 派生;启动时调 `applyWhiteLabelTheme()` |
| `lib/identityGradient.ts` | `src/lib/identityGradient.ts` | 头像身份渐变(非语义身份色,配 globals.css `.identity-1…6`) |
| `contexts/AuthContext.tsx` | `src/contexts/AuthContext.tsx` | `useHasPermission` 来源;无 Provider 优雅降级 |
| `components/*.tsx` | `src/components/` | `StatusBadge` `PermissionGate` `QueryState` `EmptyState` `PageHeader` `MockBadge` `ErrorBoundary` |
| `i18n/locales/*.json` | `src/i18n/locales/` | `zh-CN` / `en` 骨架(`common.*` + `status.*`);两份结构须一致 |
| `eslint.config.js` | 项目根 `eslint.config.js` | 改 `PRODUCT_BRAND_REGEX` 为自家品牌词 |
| `components.json` | 项目根 `components.json` | shadcn 配置;`npx shadcn add` 用 |
| `tailwind.config.ts` | 项目根(v4 通常可省;v3 必需) | 见文件内注释 |

> shadcn 原语用 `npx shadcn@latest add <name>` 生成进 `src/components/ui/`(见 [`components.md`](references/components.md))。`QueryState` / `ErrorBoundary` 依赖 shadcn `button`、`skeleton`,先 `add` 这两个。

---

## 1. 强制 vs 可选(先分清这两档)

标准分两档,**不要把可选当强制、把项目逼成同一个样子**:

| 档位 | 内容 | 说明 |
|---|---|---|
| **强制(MUST)** | token 命名体系、状态色走 statusMap、i18n 不硬编码、数据层纪律、日志不静默、ESLint 规则集 | 跨项目一致性的地基,PR review / CI 卡 |
| **可选(MAY)** | 玻璃拟态、AI-tint 卡片、身份渐变头像、虚拟滚动、Zustand | 视觉皮肤与场景能力,按项目需要取用;默认皮肤是靛紫 brand(可白标)+ 表面梯 + 标准卡片 |

判断口诀:**「机制」强制,「皮肤」可选**。statusMap 的 *机制* 必须用;具体配色值可白标替换。

---

## 2. 十条硬约束(MUST)

1. **组件用 shadcn/ui + Radix**。不自己手搓 dialog/dropdown/select 等有无障碍语义的原语。业务组件在 shadcn 之上组合。
2. **样式只用 Tailwind utility + 设计 token**,不写散落的 `.css`(除 `globals.css` token 定义 + 极少数全局工具类)。
3. **状态色必须走 `statusMap.ts`**。组件里**禁止**出现 `bg-red-500` / `text-green-600` 这类字面调色板色(ESLint `no-hardcoded-color` 强制)。详见 [`status-system.md`](references/status-system.md)。
4. **颜色只用语义 token**(`bg-background` / `text-muted-foreground` / `bg-primary` / `border-border`),不用 `bg-white` / `bg-slate-900` 等具体色——否则暗色模式必崩。
5. **所有用户可见文案走 i18n key**(`react-i18next` 的 `t()`),禁止 JSX 里硬编码中文 / 英文(ESLint `i18next/no-literal-string` 强制)。
6. **权限渲染用 `<PermissionGate permission="...">` / `useHasPermission()`**,禁止 `user.role === 'admin' && ...` 字面比较(ESLint 强制)。**前端门控 ≠ 鉴权,后端 middleware 才是权威**。
7. **日志走统一 `logger`**(`src/lib/logger.ts`),禁止裸 `console.*`;**禁止 silent catch**——`catch {}` 0 log 零容忍,catch 前有副作用必须 `logger.error`。
8. **服务端数据用 React Query**,改写后用 `invalidateQueries`,不用 `setQueryData` 手动塞缓存(防 cache 与 server 漂移)。
9. **后端 DTO 只在 `src/adapters/**` 内 `import type` 接触**,组件/hook 只见 ViewModel,不直接 import 后端类型。
10. **产品名 / 品牌词走 `import.meta.env.VITE_PRODUCT_NAME` 或 i18n `app.name`**,不 hardcode(白标约束,ESLint 强制)。

---

## 3. 红旗信号(grep 自检,出现就要停)

写完 / 改完一段,扫这些信号,命中即违约:

- `bg-(red|green|amber|yellow|blue|...)-(50..950)` → 违约束 3,改走 statusMap
- `bg-white` / `bg-black` / `text-slate-` / `bg-gray-` → 违约束 4,改语义 token
- JSX 里出现中文 / 英文字面量(非 `t()` 包裹)→ 违约束 5
- `role === 'admin'` / `role !== 'admin'` → 违约束 6,改 `<PermissionGate>`
- `console.log` / `console.error`(非 logger.ts 内部)→ 违约束 7
- `catch {` 后面没有 `logger.` → 违约束 7(silent catch)
- `queryClient.setQueryData(` → 违约束 8,优先 `invalidateQueries`
- 组件/hook 里 `from '@backend'` 或 `from '../../src/...'` → 违约束 9
- 字符串字面量含自家产品名 / 品牌词 → 违约束 10

---

## 4. 技术栈基线版本

以实战项目验证过的版本为准(可随生态升级,但保持组合一致):

| 类别 | 选型 | 备注 |
|---|---|---|
| 框架 | **React 18+** | 本标准 v1 只覆盖 React(Vue 待团队有需求再扩) |
| 构建 | **Vite 6+** | |
| 语言 | **TypeScript 5.x**(strict) | `noUnusedLocals` / `noUnusedParameters` |
| 样式 | **Tailwind CSS v4**(主) | token 写进 CSS `@theme`;**v3 写法见各分册「v3 备注」栏** |
| 组件 | **shadcn/ui**(style: new-york)+ **Radix** | `components.json` 见 `assets/` |
| 图标 | **lucide-react** | |
| 状态(服务端) | **@tanstack/react-query 5** | |
| 状态(客户端 UI) | React Context;复杂场景 **Zustand**(可选) | |
| 表单 | **react-hook-form + zod** | |
| 路由 | **react-router-dom 6+** | |
| i18n | **i18next + react-i18next**(zh-CN / en) | |
| 通知 | **sonner** | |
| 字体 | **Inter Variable**(+ CJK 回退) | |
| Lint | **ESLint 9**(flat config) | 设计规则集见 `assets/eslint.config.js` |
| 测试 | **vitest + @testing-library/react + playwright** | 前端测试**随 PR 提交并维护** |

> **Tailwind v4 vs v3 的核心差异**:v4 用 `@import "tailwindcss"` + CSS 内 `@theme` 声明 token,不再需要 `tailwind.config.ts`;颜色默认 OKLCH。v3 用 `tailwind.config.ts` 的 `theme.extend` + `:root` HSL 变量。本标准 token 同时给两套写法,存量 v3 项目照「v3 备注」栏迁移即可。

---

## 5. 取舍与历史教训

「为什么是这些约定」+ 踩过的坑,移到 [`rationale.md`](references/rationale.md)(做架构决策或想偏离某条约束前读)。可执行纪律已在上面 §2 / §3。
