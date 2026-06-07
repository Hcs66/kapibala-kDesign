# Design Tokens

> 所有颜色 / 间距 / 圆角 / 字体的**单一定义源**。组件**只引用语义 token**,不写具体色值。
> 落地文件:[`globals.css`](../assets/globals.css)(Tailwind v4 `@theme`)。
> 数值从实战项目验证过的 HSL 精确换算为 OKLCH(见各表)。

---

## 1. 命名体系(MUST)

采用 **shadcn 语义命名**,不用具体色名:

- **语义对(pair)**:每个表面色都有 `X` + `X-foreground`(背景色 + 其上的文字色)。例:`background`/`foreground`、`card`/`card-foreground`、`primary`/`primary-foreground`。
- **角色色**:`background` `foreground` `card` `popover` `primary` `secondary` `muted` `accent` `destructive` `border` `input` `ring`。
- **品牌色**:`brand`(部署期可白标覆盖);`primary` 和 `ring` 默认 **tracking** 到 `brand`。
- **状态色**:`status-success` `status-warning` `status-destructive` `status-info` `status-muted` —— 与 statusMap 的 6 个 tone 一一对应(`primary` tone 复用 `brand`)。

> **为什么不用 `surface-container-*`(Material 风)**:shadcn 生态默认语义对命名,所有 shadcn 组件开箱即用;改成 Material 命名要重写每个组件。统一到 shadcn 语义。

---

## 2. 颜色 token(OKLCH · light + dark)

> 下表即 `globals.css` 的 `:root` / `.dark` 内容。`primary` = `ring` = `var(--brand)`,不单列。
> alpha 修饰符(`bg-primary/10`、`bg-status-success/20`)在 v4 自动用 `color-mix` 生效。

### Light(`:root`)

| Token | OKLCH | 来源 HSL | 用途 |
|---|---|---|---|
| `--brand` | `oklch(0.5449 0.2154 262.74)` | `221 83% 53%` | 品牌主色(≈#2563eb),白标覆盖点 |
| `--background` | `oklch(1 0 0)` | `0 0% 100%` | 页面底 |
| `--foreground` | `oklch(0.1963 0.0092 285.53)` | `240 10% 9%` | 主文字 |
| `--card` | `oklch(1 0 0)` | `0 0% 100%` | 卡片底 |
| `--card-foreground` | `oklch(0.1963 0.0092 285.53)` | `240 10% 9%` | 卡片文字 |
| `--popover` | `oklch(1 0 0)` | `0 0% 100%` | 浮层底 |
| `--popover-foreground` | `oklch(0.1963 0.0092 285.53)` | `240 10% 9%` | 浮层文字 |
| `--primary-foreground` | `oklch(1 0 0)` | `0 0% 100%` | 主按钮文字 |
| `--secondary` | `oklch(0.9683 0.0014 286.37)` | `240 5% 96%` | 次级底 |
| `--secondary-foreground` | `oklch(0.2583 0.0128 285.47)` | `240 9% 15%` | 次级文字 |
| `--muted` | `oklch(0.9683 0.0014 286.37)` | `240 5% 96%` | 弱化底 |
| `--muted-foreground` | `oklch(0.5504 0.0144 285.92)` | `240 4% 46%` | 弱化文字 |
| `--accent` | `oklch(0.9683 0.0014 286.37)` | `240 5% 96%` | 强调底(hover) |
| `--accent-foreground` | `oklch(0.2583 0.0128 285.47)` | `240 9% 15%` | 强调文字 |
| `--destructive` | `oklch(0.5786 0.2137 27.17)` | `0 72% 51%` | 危险动作 |
| `--destructive-foreground` | `oklch(1 0 0)` | `0 0% 100%` | 危险文字 |
| `--border` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` | 边框 |
| `--input` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` | 输入框边 |
| `--status-success` | `oklch(0.6515 0.1515 152.83)` | `145 58% 42%` | 成功(绿) |
| `--status-warning` | `oklch(0.7120 0.1539 66.33)` | `35 84% 48%` | 警告(橙) |
| `--status-destructive` | `oklch(0.6023 0.1931 26.73)` | `2 70% 55%` | 错误(红) |
| `--status-info` | `oklch(0.5928 0.1588 252.51)` | `210 70% 50%` | 信息(蓝) |
| `--status-muted` | `oklch(0.5843 0.0154 285.91)` | `240 4% 50%` | 中性(灰) |

### Dark(`.dark`)

| Token | OKLCH | 来源 HSL |
|---|---|---|
| `--background` | `oklch(0.1776 0.0044 285.95)` | `240 6% 7%` |
| `--foreground` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` |
| `--card` | `oklch(0.2111 0.005 285.97)` | `240 5% 10%` |
| `--card-foreground` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` |
| `--popover` | `oklch(0.2323 0.0058 285.94)` | `240 5% 12%` |
| `--popover-foreground` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` |
| `--secondary` | `oklch(0.2747 0.006 286)` | `240 4% 16%` |
| `--secondary-foreground` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` |
| `--muted` | `oklch(0.2747 0.006 286)` | `240 4% 16%` |
| `--muted-foreground` | `oklch(0.6695 0.0149 285.99)` | `240 5% 60%` |
| `--accent` | `oklch(0.2747 0.006 286)` | `240 4% 16%` |
| `--accent-foreground` | `oklch(0.9197 0.0041 286.32)` | `240 6% 90%` |
| `--destructive` | `oklch(0.5199 0.1791 26.06)` | `0 62% 45%` |
| `--destructive-foreground` | `oklch(1 0 0)` | `0 0% 100%` |
| `--border` | `oklch(0.2948 0.0066 285.99)` | `240 4% 18%` |
| `--input` | `oklch(0.2948 0.0066 285.99)` | `240 4% 18%` |
| `--status-success` | `oklch(0.7272 0.1507 154.25)` | `145 50% 52%` |
| `--status-warning` | `oklch(0.7399 0.1312 72.04)` | `35 70% 56%` |
| `--status-destructive` | `oklch(0.6345 0.1621 24.78)` | `2 65% 60%` |
| `--status-info` | `oklch(0.6517 0.1262 250.35)` | `210 65% 58%` |
| `--status-muted` | `oklch(0.6695 0.0149 285.99)` | `240 5% 60%` |

> **v3 备注**:Tailwind v3 项目把上表 HSL 写成 `--brand: 221 83% 53%;`(裸分量),在 `tailwind.config.ts` 里用 `hsl(var(--brand) / <alpha-value>)` 引用。OKLCH 不是 v3 必需。

> **关于 shadcn 的 `--sidebar-*` / `--chart-*`**:本 token 集**有意精简**,不含 shadcn v4 脚手架里的 `sidebar` / `chart` 系列(我们用自有 `shell/` 与图表方案)。若引入 shadcn 的 `sidebar` 或 `chart` 组件,需自行补这两组 token(参照 shadcn 默认值),否则它们会回退到无样式。

---

## 3. 圆角 / 间距 / 阴影 / 字体

| 类别 | Token | 值 | 备注 |
|---|---|---|---|
| 圆角 | `--radius` | `0.5rem`(8px) | 基准;`-sm`/`-md`/`-lg`/`-xl` 由它派生 |
| | `radius-sm` | `calc(var(--radius) - 4px)` | |
| | `radius-md` | `calc(var(--radius) - 2px)` | |
| | `radius-lg` | `var(--radius)` | 卡片/按钮标准 |
| | `radius-xl` | `calc(var(--radius) + 4px)` | Insight 大容器 |
| 间距 | — | Tailwind 默认 4px 基线 | 卡片内边距用 `p-4`(16px)/ `p-6`(24px);页边距 `p-8`(32px) |
| 阴影 | `shadow-card` | `0 1px 2px 0 rgb(15 23 42 / 0.03)` | 卡片默认 |
| | `shadow-pop` | `0 8px 24px -8px rgb(15 23 42 / 0.14), 0 2px 8px -4px rgb(15 23 42 / 0.06)` | 浮层/弹窗 |
| 字体 | `font-sans` | `Inter Variable, ...` + CJK 回退 | 见 globals.css |
| | `font-mono` | `JetBrains Mono, ...` | 数字/技术值 |
| 数字 | `.tnum` | `font-variant-numeric: tabular-nums` | 表格数字对齐 |

> 字号层级(h1 36 / h2 24 / h3 20 / body 14-16,行高 1.6)走 Tailwind text-* 工具类,语义见 [`principles.md`](./principles.md)。

---

## 4. 白标(brand 运行时覆盖)

品牌色通过覆盖 `--brand` 实现一处改全局(`primary` / `ring` tracking 它):

- **部署期**:`VITE_PRIMARY_COLOR`(HEX)→ 启动时 JS 转换写入 `:root { --brand: ... }`。
  - v4:转 OKLCH 字符串写入;v3:转 `H S% L%` 裸分量。
- **产品名**:`VITE_PRODUCT_NAME` / i18n `app.name`,**禁止 hardcode**(约束 10)。
- **Logo**:`VITE_PRODUCT_LOGO_URL`。

> 因为 `--primary` 和 `--ring` 都 `= var(--brand)`,改一个 `--brand` 即换掉所有主按钮、focus ring、`primary` tone 徽章。

---

## 5. 可选皮肤 token(「智能层」视觉语言,MAY)

需要"智能层"观感(玻璃拟态 + AI 卡片)时,叠加以下可选 token(默认不启用):

| Token | 值 | 用途 |
|---|---|---|
| `--shadow-soft` | `0 4px 20px rgb(0 0 0 / 0.04)` | 更柔的卡片阴影 |
| `--shadow-elevated` | `0 8px 30px rgb(0 0 0 / 0.08)` | 抬升态 |
| `--ai-tint` | `color-mix(in oklch, var(--brand) 5%, transparent)` | AI 卡片背景微染 |
| `--ai-glow` | `0 0 15px -3px ...` | AI 卡片聚焦辉光 |

配套工具类(`.glass-panel` / `.ai-border`)见 [`principles.md`](./principles.md) §视觉语言与 globals.css 可选段。
