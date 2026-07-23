# Design Tokens

> 所有颜色 / 间距 / 圆角 / 阴影 / 动效的**单一定义源**。组件**只引用语义 token**,不写具体色值。
> 落地文件:[`globals.css`](../assets/globals.css)(Tailwind v4 `@theme`)。
> 数值从实战项目 v1.3 验证过的 HSL 精确换算为 OKLCH(见各表)。

---

## 1. 命名体系(MUST)

采用 **shadcn 语义命名**,不用具体色名:

- **语义对(pair)**:每个表面色都有 `X` + `X-foreground`(背景色 + 其上的文字色)。例:`background`/`foreground`、`card`/`card-foreground`、`primary`/`primary-foreground`。
- **角色色**:`background` `foreground` `card` `popover` `primary` `secondary` `muted` `accent` `destructive` `border` `input` `ring`。
- **表面抬升梯**:`canvas`(主内容区画布)、`sunken`(相对卡片的内凹面)——见 §3。
- **品牌色**:`brand`(部署期可白标覆盖)+ `brand-2`(渐变终点,由 brand 派生);`primary` 和 `ring` 默认 **tracking** 到 `brand`。
- **状态色**:`status-success` `status-warning` `status-destructive` `status-info` `status-muted` —— 与 statusMap 的 6 个 tone 一一对应(`primary` tone 复用 `brand`)。

> **为什么不用 `surface-container-*`(Material 风)**:shadcn 生态默认语义对命名,所有 shadcn 组件开箱即用;改成 Material 命名要重写每个组件。统一到 shadcn 语义。

---

## 2. 颜色 token(OKLCH · light + dark)

> 下表即 `globals.css` 的 `:root` / `.dark` 内容。`primary` = `ring` = `var(--brand)`,不单列。
> alpha 修饰符(`bg-brand/10`、`bg-status-success/20`)在 v4 自动用 `color-mix` 生效。
> 中性色统一带一丝主色偏向(HSL hue 250,非冷灰 240)——「选过的灰」;明度梯子关系是验收基线,调色相时明度不动。

### Light(`:root`)

| Token | OKLCH | 来源 HSL | 用途 |
|---|---|---|---|
| `--brand` | `oklch(0.514 0.2276 276.98)` | `243 75% 59%` | 品牌主色(≈#4F46E5 靛),白标覆盖点 |
| `--brand-2` | `oklch(0.6176 0.2072 296.77)` | `262 83% 66%` | 渐变终点(≈#8B5CF6),由 brand 派生,只做装饰性渐变 |
| `--background` | `oklch(1 0 0)` | `0 0% 100%` | 页面底 |
| `--foreground` | `oklch(0.2081 0.0243 291.78)` | `250 22% 11%` | 主文字 |
| `--card` | `oklch(1 0 0)` | `0 0% 100%` | 卡片底 + chrome(侧栏/顶栏) |
| `--card-foreground` | `oklch(0.2081 0.0243 291.78)` | `250 22% 11%` | 卡片文字 |
| `--canvas` | `oklch(0.9695 0.0048 293.97)` | `250 20% 96.5%` | 主内容区画布(卡片停靠的底) |
| `--sunken` | `oklch(0.9833 0.0019 294.03)` | `250 14% 98%` | 输入框/下拉/表头(相对卡片内凹) |
| `--popover` | `oklch(1 0 0)` | `0 0% 100%` | 浮层底 |
| `--popover-foreground` | `oklch(0.2081 0.0243 291.78)` | `250 22% 11%` | 浮层文字 |
| `--primary-foreground` | `oklch(1 0 0)` | `0 0% 100%` | 主按钮文字 |
| `--secondary` | `oklch(0.9664 0.0038 293.99)` | `250 14% 96%` | 次级底 |
| `--secondary-foreground` | `oklch(0.2519 0.023 292.3)` | `250 16% 15%` | 次级文字 |
| `--muted` | `oklch(0.9664 0.0038 293.99)` | `250 14% 96%` | 弱化底 |
| `--muted-foreground` | `oklch(0.5488 0.0297 293.04)` | `250 8% 47%` | 弱化文字 |
| `--accent` | `oklch(0.9664 0.0038 293.99)` | `250 14% 96%` | **hover 底**(见下方警告) |
| `--accent-foreground` | `oklch(0.2519 0.023 292.3)` | `250 16% 15%` | 强调文字 |
| `--destructive` | `oklch(0.5786 0.2137 27.17)` | `0 72% 51%` | 危险动作 |
| `--destructive-foreground` | `oklch(1 0 0)` | `0 0% 100%` | 危险文字 |
| `--border` | `oklch(0.9156 0.0097 293.87)` | `250 14% 90%` | 边框 |
| `--input` | `oklch(0.9156 0.0097 293.87)` | `250 14% 90%` | 输入框边 |
| `--status-success` | `oklch(0.6515 0.1515 152.83)` | `145 58% 42%` | 成功(绿) |
| `--status-warning` | `oklch(0.712 0.1539 66.33)` | `35 84% 48%` | 警告(橙) |
| `--status-destructive` | `oklch(0.6023 0.1931 26.73)` | `2 70% 55%` | 错误(红) |
| `--status-info` | `oklch(0.5928 0.1588 252.51)` | `210 70% 50%` | 信息(蓝) |
| `--status-muted` | `oklch(0.5796 0.0233 293.31)` | `250 6% 50%` | 中性(灰) |

### Dark(`.dark`)

| Token | OKLCH | 来源 HSL |
|---|---|---|
| `--background` | `oklch(0.1734 0.0103 292.93)` | `250 14% 7%` |
| `--foreground` | `oklch(0.9167 0.0083 293.9)` | `250 12% 90%` |
| `--card` | `oklch(0.2163 0.0132 292.91)` | `250 12% 11%` |
| `--card-foreground` | `oklch(0.9167 0.0083 293.9)` | `250 12% 90%` |
| `--canvas` | `oklch(0.1734 0.0103 292.93)` | `250 14% 7%` |
| `--sunken` | `oklch(0.2485 0.0135 293.04)` | `250 10% 14%` |
| `--popover` | `oklch(0.2265 0.0142 292.87)` | `250 12% 12%` |
| `--popover-foreground` | `oklch(0.9167 0.0083 293.9)` | `250 12% 90%` |
| `--secondary` | `oklch(0.2682 0.0151 293)` | `250 10% 16%` |
| `--secondary-foreground` | `oklch(0.9167 0.0083 293.9)` | `250 12% 90%` |
| `--muted` | `oklch(0.2682 0.0151 293)` | `250 10% 16%` |
| `--muted-foreground` | `oklch(0.6638 0.0241 293.38)` | `250 8% 60%` |
| `--accent` | `oklch(0.2682 0.0151 293)` | `250 10% 16%` |
| `--accent-foreground` | `oklch(0.9167 0.0083 293.9)` | `250 12% 90%` |
| `--destructive` | `oklch(0.5199 0.1791 26.06)` | `0 62% 45%` |
| `--destructive-foreground` | `oklch(1 0 0)` | `0 0% 100%` |
| `--border` | `oklch(0.2876 0.0167 292.96)` | `250 10% 18%` |
| `--input` | `oklch(0.2876 0.0167 292.96)` | `250 10% 18%` |
| `--status-success` | `oklch(0.7272 0.1507 154.25)` | `145 50% 52%` |
| `--status-warning` | `oklch(0.7399 0.1312 72.04)` | `35 70% 56%` |
| `--status-destructive` | `oklch(0.6345 0.1621 24.78)` | `2 65% 60%` |
| `--status-info` | `oklch(0.6517 0.1262 250.35)` | `210 65% 58%` |
| `--status-muted` | `oklch(0.6638 0.0241 293.38)` | `250 8% 60%` |

三条硬规则(实战验收过,别动):

- **`--brand` / `--brand-2` 亮暗同值**(`.dark` 里刻意不重定义):brand 是实心按钮底 + 白字,暗色下提亮反而降低白字对比度(L=59% 时白字 ≈4.6:1,达 UI 组件 AA)。
- **`--accent` 保持中性,不要改成品牌色**:它在 shadcn 原语里是 hover 底(DropdownMenuItem / SelectItem / CommandItem / Button.ghost),改了会让所有菜单项一 hover 变成实心品牌色。「选中态」的标准写法是 `bg-brand/10 text-brand`(不需要新 token)。
- **状态色是语义,不是装饰**:视觉升级 / 白标换肤 / 中性色调整都**不动**这五个 status 值(`status-muted` 的中性色相除外,它随中性带走)。品牌色相必须与全部 status 色相拉开 ≥20°,品牌与语义不抢同一色相。

> **v3 备注**:Tailwind v3 项目把上表「来源 HSL」列写成 `--brand: 243 75% 59%;`(裸分量),在 `tailwind.config.ts` 里用 `hsl(var(--brand) / <alpha-value>)` 引用(完整 config 见 [`tailwind.config.ts`](../assets/tailwind.config.ts) 注释)。OKLCH 不是 v3 必需。

> **关于 shadcn 的 `--sidebar-*` / `--chart-*`**:本 token 集**有意精简**,不含 shadcn v4 脚手架里的 `sidebar` / `chart` 系列(我们用自有 `shell/` 与图表方案)。若引入 shadcn 的 `sidebar` 或 `chart` 组件,需自行补这两组 token(参照 shadcn 默认值),否则它们会回退到无样式。

---

## 3. 表面抬升梯(elevation ladder,MUST)

三级表面回答的是「**这一层比它的底高还是低**」,而不只是「这一层什么颜色」:

| 表面 | 角色 | 亮色 | 暗色 |
|---|---|---|---|
| `canvas` | 主内容区画布(卡片停靠的底) | 96.5%(比卡片暗) | 7%(最深) |
| `card` | 卡片 + chrome(侧栏/顶栏同为最高面) | 100% | 11%(比 canvas 高 4pp,卡片浮起) |
| `sunken` | 输入框 / 下拉框 / 表头(相对卡片**内凹**) | 98%(比卡片暗 2pp) | 14%(比卡片**亮** 3pp) |

- **亮色**:canvas < card;sunken 比卡片暗、但只暗 2pp——刻意做轻,重了密集表格页显脏。
- **暗色方向相反**:sunken 靠「**更亮**」表达内凹(内嵌感靠亮度差,不是「更暗」)。这是最容易被「顺手改反」的一条,建议加 token 守卫测试钉住(解析 globals.css 断言明暗方向)。
- 输入框 / 下拉框 / 表头三者底色必须**完全一致**(都用 `bg-sunken`)。
- chrome(侧栏/顶栏)直接用 `bg-card`,与卡片同为最高面。

---

## 4. 圆角 / 间距 / 阴影 / 动效 / 字体

| 类别 | Token | 值 | 备注 |
|---|---|---|---|
| 圆角 | `--radius` | `0.5rem`(8px) | 基准;`-sm`/`-md`/`-lg`/`-xl` 由它派生 |
| | `radius-sm` | `calc(var(--radius) - 4px)` | |
| | `radius-md` | `calc(var(--radius) - 2px)` | |
| | `radius-lg` | `var(--radius)` | 卡片/按钮标准 |
| | `radius-xl` | `calc(var(--radius) + 4px)` | Insight 大容器 |
| 间距 | — | Tailwind 默认 4px 基线 | 卡片内边距 `p-4`/`p-6`;页边距 `p-8` |
| 阴影 | `shadow-card` | `var(--elevation-card)`(亮暗各一套) | 卡片默认;含暗色顶边内高光 |
| | `shadow-pop` | `var(--elevation-pop)` | 浮层/弹窗/hover 抬升态 |
| 动效 | `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | 全站唯一缓动(class `ease-out`) |
| | `duration-fast` | `120ms` | 行 hover / 微反馈 |
| | `duration-base` | `180ms` | 默认过渡(卡片抬升 / 按钮) |
| | `duration-slow` | `280ms` | 页面级 fade-in |
| 字体 | `font-sans` | `Inter Variable, ...` + CJK 回退 | 见 globals.css |
| | `font-mono` | `JetBrains Mono, ...` | 数字/技术值 |
| 数字 | `.tnum` | `font-variant-numeric: tabular-nums` | 表格数字对齐 |

### 阴影系统(细则)

- **整条阴影收进单个 CSS 变量,亮暗各一套**(`--elevation-card` / `--elevation-pop`),`shadow-card` / `shadow-pop` 两主题共用同一个 class。
- 亮色阴影用**靛紫墨**(`rgb(30 27 75 / …)`)而非纯黑——纯黑在浅底上发灰显脏;暗色反过来用**纯黑 + 高得多的 alpha**(靛紫墨在深底上看不见)。
- **`--card-highlight`(卡片顶边 1px 内高光)**:亮色必须 `transparent`(白卡加白高光只会糊掉上边框);暗色微白(`/0.06`)——这是暗色卡片「有厚度」的真正来源,纯亮度差做不到。
- **阴影颜色必须写字面量**。v3 项目不能拆成 `rgb(var(--x) / var(--y))` 塞进 config 的 `boxShadow`——Tailwind v3 解析不了嵌套 `var()`,会把颜色整个替换掉,阴影完全不可见且截图看不出来(实战踩坑,见 [`rationale.md`](./rationale.md))。
- **阴影只给「浮起的容器」**(Card / Dialog / Popover / Sheet),不下放到表格单元格——密集表格页会糊成一片。

### 身份渐变 token(`.identity-1 … .identity-6`)

头像位按实体 ID 哈希取色(配套 [`lib/identityGradient.ts`](../assets/lib/identityGradient.ts)),**不承载语义**;色板避开全部 status 色相区 ±20°。写在 `@layer` 之外的裸 CSS(v3 purge 免疫),详见 globals.css 注释与 [`principles.md`](./principles.md) §8。

---

## 5. 白标(brand 运行时覆盖)

品牌色通过覆盖 `--brand` 实现一处改全局(`primary` / `ring` tracking 它),落地文件 [`lib/whitelabel.ts`](../assets/lib/whitelabel.ts):

- **部署期**:`VITE_PRIMARY_COLOR`(HEX)→ 启动时 `applyWhiteLabelTheme()` 写入 `:root`。
  - v4:变量存完整颜色值,直接写 `hsl(...)` / HEX;v3:写 `H S% L%` 裸分量。
- **`--brand-2` 永远由 brand 派生**(`deriveBrand2`,固定偏移 +19° 色相 / +8% 饱和 / +7% 明度),**不接受独立配置**——否则白标客户拿到「自定义主色 + 固定默认紫」的怪组合(双写入点漂移)。
- **产品名**:`VITE_PRODUCT_NAME` / i18n `app.name`,**禁止 hardcode**(约束 10)。
- **Logo**:`VITE_PRODUCT_LOGO_URL`。

> ⚠ **默认品牌色的「真源」是部署期环境变量,不是 CSS 里的默认值**:`applyWhiteLabelTheme()` 启动时会用 `VITE_PRIMARY_COLOR` 覆盖 `:root`,改了 globals.css 的默认值而忘了 `.env.example`,运行时仍是旧色(实战踩坑)。改默认品牌色必须同步 `.env.example`,建议加测试钉住两处不漂移。

> 因为 `--primary` 和 `--ring` 都 `= var(--brand)`,改一个 `--brand` 即换掉所有主按钮、focus ring、`primary` tone 徽章、品牌渐变。

---

## 6. 可选皮肤 token(「智能层」视觉语言,MAY)

需要"智能层"观感(玻璃拟态 + AI 卡片)时,叠加以下可选 token(默认不启用;**密集表格型后台不要启用玻璃拟态**,见 [`principles.md`](./principles.md) §9):

| Token | 值 | 用途 |
|---|---|---|
| `--ai-tint` | `color-mix(in oklch, var(--brand) 5%, transparent)` | AI 卡片背景微染 |
| `--ai-glow` | `0 0 15px -3px ...` | AI 卡片聚焦辉光 |

配套工具类(`.glass-panel` / `.ai-tint` / `.ai-glow`)见 globals.css 可选段。
