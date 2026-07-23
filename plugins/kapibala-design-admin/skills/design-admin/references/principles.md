# 设计哲学与视觉语言(Principles)

> 管理后台的视觉与版式准则。**默认皮肤**(靛紫 brand admin)是强制基线;**「智能层」皮肤**(玻璃拟态 + AI 卡片)是可选叠加。
> 写界面前先读本篇定调性,再去 [`tokens.md`](./tokens.md) 取具体值。

---

## 1. 定调:克制的分析力,人格加在不承载语义的地方

管理后台服务的是**长时间盯数据做决策**的运营/管理者。目标观感:**冷静、可信、低认知负荷**——但不等于冷淡。

核心原则:**活泼(人格)只加在不承载状态语义的地方**。

- **可以自由加人格的六处**:品牌表面(渐变/光晕)· 版式重量(大标题/hero 数字)· 深度与光(阴影/暗色内高光)· 动效 · 身份色(头像渐变)· 数据可视化。
- **一格不动的**:状态色(在线/警告/错误/禁言)、平台与模式的分类标记、默认值 chip。状态色是语义,不是装饰。

**色彩预算三规则**(收紧色彩,让异常真正跳出来):

1. **分类降中性**:分类/平台/模式标记用中性灰,不抢状态色。
2. **默认值安静**:默认态、常态不上色;颜色留给需要注意的事。
3. **同一事实只上一次色**:一行里同一状态不要点、徽章、文字三处齐染。

其余基线:少即是多(留白分组,非边框堆砌)、数据优先、一致优于花哨(新场景先找现成模式)。

---

## 2. 字体与字号层级(MUST)

全站 **Inter**(界面)+ **JetBrains Mono**(数字/技术值),CJK 自动回退。统一字号层级(实战 v1.3 验收基线):

| 角色 | 字号 | 字重 | Tailwind | 备注 |
|---|---|---|---|---|
| H1 页面标题 | 24px | 700 | `text-2xl font-bold tracking-tight` | 走 `PageHeader`,**每页唯一 h1** |
| H2 区块/卡片标题 | 16px | 600 | `text-base font-semibold tracking-tight` | CardTitle 即此 |
| KPI 数字 | 30px | 700 | `text-3xl font-bold tnum tracking-tight` | 统计卡默认 |
| KPI hero 数字 | 40px | 700 | `text-4xl` + 品牌渐变裁字 | **同一时刻只一张 hero 卡**,见 §6 |
| Body-lg 正文/摘要 | 16px | 400 | `text-base` | |
| Body 默认正文 | 14px | 400 | `text-sm` | 行高 1.6,数据密集视图可读 |
| Label 标签 | 12px | 500 | `text-xs font-medium` | 小字放宽字距防糊 |
| Mono 技术值 | 11px | 600 | `font-mono text-[11px] font-semibold tracking-wider` | |

原则:**页头是全站唯一的一级落点**——它若只比正文大几个像素,扫视时没有着力点;「大气」在版式上就是敢用大字,字号拉开后周围的留白才读得出来。层级靠字重 + 字号差建立;数字列加 `.tnum`(等宽数字)对齐。

---

## 3. 布局与间距(MUST)

- **栅格**:主内容区 **12 列流式栅格**,随屏幕缩放。Dashboard 统计卡可用不等宽 bento 栅格(如 `1.45fr 1fr 1fr 1fr`)突出主卡。
- **间距节奏**:严格 **4px / 8px 基线**(Tailwind 默认刻度即此)。
- **页边距**:宽松(`p-8` ≈ 32px),撑出"呼吸感",别贴边。
- **卡片内边距**:统一 `p-4`(16px)或 `p-6`(24px),同一页面别混用多个值。
- **元素间距**:用 `gap-*`(flex/grid)而非 margin 堆叠。
- **容器**:页面最大宽度建议 `max-w-[1400px]` 居中。
- **表格每一列都设宽度**:auto-layout 下没设宽的列会吃掉全部剩余宽度,把内容挤到一边、拖出大片空白。修法不是「把剩余甩给另一列」,而是让每列都有 `w-*`,浏览器把剩余按比例分摊(实战教训)。

---

## 4. 圆角与形状(MUST)

**柔和圆角**,几何精确 + 不尖锐:

- 标准组件(按钮/输入/卡片):`rounded-lg`(8px)。
- 大容器 / Insight 模块:`rounded-xl`。
- 全圆 `rounded-full`:**只**用于状态点、徽章 pill、头像。

---

## 5. 层次与深度(MUST)

深度 = **表面抬升梯 + 分级阴影 + 暗色内高光**,不用粗重投影。三级表面(token 细则见 [`tokens.md`](./tokens.md) §3):

1. **canvas**(主内容区画布):卡片停靠的底,亮色比卡片暗、暗色最深。
2. **card**(卡片 + 侧栏/顶栏 chrome):最高面,`bg-card border shadow-card`。
3. **sunken**(输入框/下拉/表头):相对卡片**内凹**——亮色比卡片暗 2pp,**暗色反而比卡片亮**(内嵌感靠亮度差)。三处底色必须完全一致。

阴影两级:`shadow-card`(静置)/ `shadow-pop`(浮层与 hover 抬升),亮暗各一套、单变量整条切换;暗色卡片的「厚度」来自顶边 1px 微白内高光(`--card-highlight`),不是更重的投影。**阴影只给浮起的容器**(Card/Dialog/Popover/Sheet),不下放到表格单元格。

聚焦态:输入框 focus → 边框转品牌色 + `ring-2 ring-ring`。

> 暗色模式靠 token 自动切换——只要用语义 token(`bg-card` 而非 `bg-white`),无需为暗色单独写样式。

---

## 6. 组件视觉约定(对齐 shadcn 默认)

- **按钮**:主操作 `bg-primary text-primary-foreground`;次操作 ghost / outline;危险操作 `destructive`。统一 `rounded-lg`。
- **卡片**:`bg-card border shadow-card`。**可点击卡片**加 hover 抬升(`transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-0.5 hover:shadow-pop`)——**只给真正可点的**,静态卡片加了会骗人;容器类卡片(表格外壳/表单面板)一律不加。
- **输入框 / 下拉 / 表头**:`bg-sunken` + `border-input`,focus 转 `ring-ring`。
- **徽章/状态**:小号 `rounded-full` pill,低饱和底色(tone/10)+ 同色文字——**必须经 statusMap**(见 [`status-system.md`](./status-system.md))。
- **选中态**:`bg-brand/10 text-brand`(全站唯一写法)。**不要把 `--accent` 改成品牌色**——它是 shadcn 原语的 hover 底,改了所有菜单一 hover 变实心品牌色。父级分组的「你在这个分组下」可用中性灰与品牌色选中态区分层级。
- **列表/表格行 hover**:`hover:bg-muted/50` + `transition-colors duration-fast ease-out`(淡入,不硬切);分隔用 `divide-border` 细线;数字列 `.tnum` 右对齐;表头 `text-muted-foreground text-xs`。
- **hero 统计卡**:主 KPI 数字 `text-4xl` + 品牌渐变裁字(`bg-gradient-to-br from-foreground to-brand bg-clip-text text-transparent`)。**同一时刻只该有一张 hero 卡**——四张都渐变等于都不渐变;loading / error 态不渐变。
- **空态**:图标用品牌光晕徽章(`bg-brand/[0.07] text-brand` + 内描边),文案写「会发生什么」而非「什么都没有」,给明确的下一步按钮(见 `EmptyState`)。

---

## 7. 动效语言(MUST)

**动效的作用是「确认我点到了」,不是表演。** 管理后台是高频操作工具,超过 200ms 的过渡就是拖累。

- **Token**:全站唯一缓动 `ease-out`(`cubic-bezier(0.22,1,0.36,1)`)+ 三档时长 `duration-fast`(120ms)/ `duration-base`(180ms)/ `duration-slow`(280ms)。
- **落点**:可点卡片 hover 抬升、表格行 hover 背景淡入、主按钮 hover 微亮、页面切换 fade-in——就这些,别扩散。
- **边界**:**不做**数字 count-up、**不做**滚动触发动画。
- **reduced-motion**:全局兜底把所有动画/过渡压到 `0.01ms`,**不是 `none`**——完全去掉会让依赖 `transitionend` 的 Radix 原语(Dialog/Sheet 退场)收不到事件而卡住不卸载(globals.css 已带)。

---

## 8. 身份渐变头像(推荐)

灰底灰字首字母一整列毫无节奏,是界面「冷淡」最直接的来源。头像位按实体 ID 哈希取 6 个预设渐变之一(`lib/identityGradient.ts` + globals.css `.identity-1…6`),首字母白字:

- **不承载任何语义**——纯身份识别(同一实体永远同色),不受 statusMap 色彩预算约束。
- **色板必须避开 status 色相区 ±20°**(红 2° / 琥珀 35° / 绿 145° / 蓝 210°),否则绿头像被误读成「在线」;可用区间只剩青(165–190°)与靛→紫→品红(230–342°)。
- CSS 规则写在 `@layer` 之外(v3 purge 免疫,见 [`rationale.md`](./rationale.md))。

---

## 9. 可选「智能层」皮肤(MAY)

需要 AI 产品观感时叠加(token 见 [`tokens.md`](./tokens.md) §6):

- **玻璃拟态导航**:侧边栏/顶栏用 `.glass-panel`(backdrop-blur + 半透明底)。
- **AI 卡片**:`.ai-tint` 微染品牌色背景 + `.ai-glow` 聚焦辉光,标识"机器生成"。

> **⚠ 密集表格型后台不要启用玻璃拟态**——模糊层拖垮可读性与渲染性能;它只适合营销页、低密度看板、大屏 kiosk(深色单主题 + 远距离观看)这类场景。不启用时默认皮肤完全够用,**不要为了"高级感"默认全开**。

---

## 10. 无障碍底线(MUST)

- 用 shadcn/Radix 原语,天然带键盘导航 + ARIA;**别用 `<div onClick>` 替代 `<button>`**。
- 文字对比度达 WCAG AA(语义 token 已按此调过,别用 tone/10 这种浅色当正文色;brand 亮暗同值正是为保白字对比,见 tokens.md)。
- 交互元素有可见 focus ring(`ring-ring`),别 `outline-none` 了事。
- 图标按钮配 `aria-label`(可走 i18n,该属性在 ESLint i18n 规则豁免名单)。
- 装饰性元素(空态光晕、身份头像)加 `aria-hidden`。
