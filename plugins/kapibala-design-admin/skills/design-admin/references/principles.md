# 设计哲学与视觉语言(Principles)

> 管理后台的视觉与版式准则。**默认皮肤**(中性蓝 admin)是强制基线;**「智能层」皮肤**(玻璃拟态 + AI 卡片)是可选叠加。
> 写界面前先读本篇定调性,再去 [`tokens.md`](./tokens.md) 取具体值。

---

## 1. 定调:克制的分析力

管理后台服务的是**长时间盯数据做决策**的运营/管理者。目标观感:**冷静、可信、低认知负荷**。

- **少即是多**:用留白和层级分组,而非边框和分隔线堆砌信息。
- **数据优先**:颜色为语义服务(状态、强调),不做装饰性渲染。
- **一致优于花哨**:同类元素永远同一种处理;新场景先找现成模式,不发明新样式。
- **可选的"智能层"观感**:涉及 AI 生成内容时,可用柔和品牌色辉光 + 渐变边框,把"机器产出"和"普通数据"在视觉上区分开。

---

## 2. 字体与字号层级(MUST)

全站 **Inter**(界面)+ **JetBrains Mono**(数字/技术值),CJK 自动回退。统一字号层级:

| 角色 | 字号 | 字重 | 行高 | 字距 | Tailwind |
|---|---|---|---|---|---|
| H1 页面标题 | 36px | 700 | 1.2 | -0.02em | `text-4xl font-bold tracking-tight` |
| H2 区块标题 | 24px | 600 | 1.3 | -0.01em | `text-2xl font-semibold tracking-tight` |
| H3 卡片标题 | 20px | 600 | 1.4 | -0.01em | `text-xl font-semibold` |
| Body-lg 正文/AI 摘要 | 16px | 400 | 1.6 | 0 | `text-base` |
| Body 默认正文 | 14px | 400 | 1.6 | 0 | `text-sm` |
| Label 标签 | 12px | 500 | 1.4 | 0.02em | `text-xs font-medium` |
| Mono 技术值 | 11px | 600 | 1 | 0.05em | `font-mono text-[11px] font-semibold tracking-wider` |

原则:**层级靠字重 + 行高建立**,正文行高放宽到 1.6 保证数据密集视图可读;标题收紧字距以聚焦;小标签放宽字距防糊。数字列加 `.tnum`(等宽数字)对齐。

---

## 3. 布局与间距(MUST)

- **栅格**:主内容区 **12 列流式栅格**,随屏幕缩放。
- **间距节奏**:严格 **4px / 8px 基线**(Tailwind 默认刻度即此)。
- **页边距**:宽松(`p-8` ≈ 32px),撑出"呼吸感",别贴边。
- **卡片内边距**:统一 `p-4`(16px)或 `p-6`(24px),同一页面别混用多个值。
- **元素间距**:用 `gap-*`(flex/grid)而非 margin 堆叠;列表项垂直 padding 给足。
- **容器**:页面最大宽度建议 `max-w-[1400px]` 居中(超宽屏不让内容拉满)。

---

## 4. 圆角与形状(MUST)

**柔和圆角**,几何精确 + 不尖锐:

- 标准组件(按钮/输入/卡片):`rounded-lg`(8px)。
- 大容器 / Insight 模块:`rounded-xl`(≈12–16px)柔化。
- 全圆 `rounded-full`:**只**用于状态点、徽章 pill、头像。
- 其余一律不用全圆。

---

## 5. 层次与阴影(MUST)

用**表面层级 + 柔和环境阴影**表达深度,不用粗重投影:

1. **底层**:`bg-background`(页面底)。
2. **卡片层**:`bg-card` + `border` + `shadow-card`(极柔)。
3. **浮层**(弹窗/下拉/popover):`bg-popover` + `shadow-pop`。
4. **聚焦态**:输入框 focus → 边框转品牌色 + 细品牌色 ring(`ring-2 ring-ring`)。

> 暗色模式靠 token 自动切换——只要用语义 token(`bg-card` 而非 `bg-white`),无需为暗色单独写样式。

---

## 6. 组件视觉约定(对齐 shadcn 默认)

- **按钮**:主操作 `bg-primary text-primary-foreground`;次操作 ghost / outline(`border` + 透明底);危险操作 `destructive`。统一 `rounded-lg`。
- **卡片**:`bg-card border shadow-card`。标题 H3,内容 Body。
- **输入框**:`border-input` 极简,focus 转 `ring-ring`。
- **徽章/状态**:小号 `rounded-full` pill,低饱和底色(tone/10)+ 同色文字——**必须经 statusMap**(见 [`status-system.md`](./status-system.md)),禁止手写色。
- **列表**:高密度列表行 hover 用 `hover:bg-accent`(极浅品牌/中性染),分隔用 `divide-border` 细线。
- **表格**:数字列 `.tnum` 右对齐;表头 `text-muted-foreground text-xs`。

---

## 7. 可选「智能层」皮肤(MAY)

需要 AI 产品观感时叠加(token 见 [`tokens.md`](./tokens.md) §5,工具类见 `globals.css` 可选段):

- **玻璃拟态导航**:侧边栏 / 顶栏用 `.glass-panel`(backdrop-blur 16px + 半透明白底 + 细边),让背景隐约透出。
- **AI 卡片**:`.ai-tint` 微染品牌色 5% 背景 + `.ai-glow` 聚焦辉光 + sparkle 图标,标识"机器生成"。
- **配色取向**:Indigo + Slate;背景用微染灰白(非纯白 `#fff`)减轻长时间用眼疲劳。
- **微动效**:进入 0.2–0.25s `ease-out` 淡入/上滑;克制,不喧宾夺主。

> 不启用时:默认皮肤就是干净的中性蓝 admin,完全够用。**不要为了"高级感"默认全开玻璃拟态**——它有性能成本且不是所有后台都合适。

---

## 8. 无障碍底线(MUST)

- 用 shadcn/Radix 原语,天然带键盘导航 + ARIA;**别用 `<div onClick>` 替代 `<button>`**。
- 文字对比度达 WCAG AA(语义 token 已按此调过,别用 tone/10 这种浅色当正文色)。
- 交互元素有可见 focus ring(`ring-ring`),别 `outline-none` 了事。
- 图标按钮配 `aria-label`(可走 i18n,该属性在 ESLint i18n 规则豁免名单)。
