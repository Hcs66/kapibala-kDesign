# 取舍与历史教训(Rationale)

> 「为什么是这些约定」+ 踩过的坑。写代码时不必每次读;做架构决策、或想偏离某条约束前读它。
> 可执行的纪律已收进 `SKILL.md` 的硬约束与红旗信号,本篇只讲来由。

---

## 1. 关键取舍(为什么是这些约定)

| 维度 | 好实践 | 反例 | 本标准取舍 |
|---|---|---|---|
| 状态色 | `statusMap.ts` 单源 + ESLint 强制 ✅ | 散落 `bg-red-100` inline ❌ | **采纳单源**——这是最大差异化资产 |
| Token 命名 | shadcn 语义(`background`/`muted`) | Material 风(`surface-container-*`) | 取 **shadcn 语义**(生态对齐) |
| 组件库 | shadcn + Radix ✅ | 全自研无障碍原语 | 取 **shadcn** |
| 设计哲学文档 | 有独立设计语言文档 ✅ | 无,只散在代码 | 采纳(见 [`principles.md`](principles.md)) |
| 视觉语言 | 克制的语义色 admin(v1.3 起默认靛紫 brand) | 玻璃拟态 + AI-tint | 抽成 **可选皮肤** |
| 工程纪律 | ESLint/adapter/i18n/logger 全套 ✅ | 仅 TS 安全 | 取 **全套** |

**一句话**:工程纪律做骨架,设计哲学做皮肤,统一历史上的状态色不一致。

---

## 2. 历史教训(直接抄进标准的反模式)

- **状态色散落**:把 `bg-red-100 text-red-700` 直接写进各 feature 组件,同一"高优先级"在多个文件多种写法。→ 本标准强制 statusMap 单源。
- **silent catch**:`} catch { ... }` 0 log 把运行时异常完全吞掉,线上点击无响应排查数小时(真实事故)。→ 约束 7 零容忍。
- **跨 try/catch 变量作用域**:`try` 块内 `let x`、`catch` 闭包引用 `x` → `ReferenceError`(同上事故)。→ 跨边界引用的变量提升到外层函数作用域。
- **手动塞 query 缓存**:`setQueryData` 后 cache 与 server 漂移。→ 约束 8 用 `invalidateQueries`。

---

## 3. v1.3 视觉体系升级的教训(2026-07,实战)

> 共同点:下面前三个坑都是「**测试绿 + 截图看着正常,但实际坏了**」。只有浏览器 `getComputedStyle` 或生产构建产物能抓到——**改 token 层不做浏览器实测 = 裸奔**。

- **品牌色有两个写入点,`.env` 才是真源**:改完 globals.css 的 `--brand` 默认值,运行时仍是旧色——因为 `applyWhiteLabelTheme()` 启动时用 `VITE_PRIMARY_COLOR` 覆盖了它,而 `.env.example` 里写死着旧色。→ 改默认品牌色必须同步 `.env.example`,并加测试钉住两处不漂移。同理 `--brand-2` 若不进白标派生链路(`deriveBrand2`),就是「新增状态只有一个写入点、另一处读不到」的翻版。
- **Tailwind v3 会把 boxShadow 里的颜色替换掉**:config 里写 `card: '0 1px 2px rgb(var(--rgb) / var(--alpha))'`,v3 要解析 boxShadow 颜色生成 `--tw-shadow-colored`,认不出嵌套 `var()`,把颜色整个换掉——亮色下阴影变纯白、暗色下变卡片色,完全不可见。→ 整条阴影收进**单个 CSS 变量**(亮暗各一套),config 只写 `card: 'var(--shadow-card)'`,变量里的颜色写字面量。
- **Tailwind v3 会 purge 掉 `@layer` 里动态拼接的 class**(栽过两次):身份渐变类名运行时哈希拼出(`identity-${n}`),源码无字面量,静态扫描找不到 → 规则被 purge,连 `color: white` 也一起没了,头像变「透明圆 + 白字」在白底上彻底隐形。第一次靠 safelist 修,第二次才发现 safelist 改 config 要重启 dev server。→ 最终修法:**写成 `@layer` 之外的裸 CSS**(不受 purge 影响,改它也不用重启);safelist 只留作双保险。这类 bug **单测抓不到**(断言读的是源文件,看不见构建期 purge)。
- **`--accent` 保持中性是对的(撤回过的提案)**:「accent 与 muted 逐字相同 = 少了一层」的诊断成立,但改 accent 或新增 `--selected` token 都是错修法——accent 是 shadcn 原语的 hover 底(菜单项/下拉项/ghost 按钮),改成品牌色会让所有菜单一 hover 变实心品牌色;而「选中态」早有事实标准 `bg-brand/10 text-brand`,不需要新 token。→ 在 token 上加注释锁住,防下一个人「顺手统一」。
- **三种选中态可以是层级区分,不是不一致**:品牌色 = 「你在这一页」(叶子项),中性灰 = 「你在这个分组下」(父级,它本身不是页面)。父子同染品牌色反而分不出当前页。→ 想「统一」前先读代码确认是不是 by-design。
- **表格没设宽的列会吃掉全部剩余宽度**:auto-layout 下唯一没设宽的列把内容挤到一边、拖出大片空白;把剩余「甩给另一列」只是挪走空白。→ 每一列都设宽度,浏览器按比例分摊。
- **token 层要有自动防护网**:全站测试无一处断言颜色时,token 改动的唯一防线是人工截图。→ 加「token 守卫测试」直接解析 globals.css 源文本断言:表面梯明暗方向(尤其「暗色 sunken 比 card 亮」这条最易改反)、brand 与 status 色相 ≥20°、status 值逐字钉死、亮色 card-highlight 必须透明、阴影颜色不得嵌套 `var()`、`.env` 与 CSS 默认值不漂移、base 过渡 ≤200ms、reduced-motion 兜底存在且不是 `animation: none`。写完守卫做**变异测试**(故意改反一条,确认被拦)。
