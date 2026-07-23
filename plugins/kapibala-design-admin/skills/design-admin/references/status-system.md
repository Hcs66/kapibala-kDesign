# 状态语义色系统(Status System)

> ⭐ 本标准最核心的差异化资产。所有"状态徽章 / 状态点 / 状态文案"的颜色与文案,**必须**查一张统一映射表,**不允许**在组件里写字面色。
> 落地文件:[`statusMap.ts`](../assets/statusMap.ts)。
> 源自实战项目的 `src/lib/statusMap.ts`,本标准抽成通用骨架 + 示例域表。

---

## 1. 为什么需要它(问题陈述)

反例(常见反模式,**禁止**):同一个"高优先级"在不同文件各写各的——

```tsx
// TodayFocus.tsx
critical: 'bg-red-100 text-red-700'
// InsightsPanel.tsx
high: 'bg-red-50 text-red-700 border-red-200'
// TimelinePanel.tsx
lead: { dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' }
```

后果:① 颜色不一致(red-100 vs red-50);② 暗色模式全崩(写死浅色);③ 改配色要全局 grep 替换;④ 无法保证"红色=危险"的语义一致。

**对策**:状态 → `tone`(6 选 1)→ Tailwind class,集中在一个文件,ESLint 禁止旁路。

---

## 2. 核心机制(三层)

```
业务状态字符串 ("online" / "failed" / "high" ...)
        │  查 statusMap 域表
        ▼
   StatusDef { tone, i18nKey, fallback }
        │  tone → class 映射
        ▼
   TONE_BADGE_CLASS[tone] / TONE_DOT_CLASS[tone]
        │
        ▼
   <StatusBadge> 渲染(颜色 + i18n 文案)
```

**6 个 tone**(语义,非颜色名):

| tone | 含义 | 映射 token | 典型场景 |
|---|---|---|---|
| `success` | 正常 / 成功 / 活跃 | `status-success`(绿) | online, running, published |
| `warning` | 警示 / 降级 / 临时异常 | `status-warning`(橙) | disconnected, degraded, paused |
| `destructive` | 失败 / 危险 / 不可恢复 | `status-destructive`(红) | failed, banned, error |
| `info` | 中性信息 / 进行中 | `status-info`(蓝) | in_progress, pool |
| `muted` | 空闲 / 停用 / 已归档 | `status-muted`(灰) | idle, disabled, archived |
| `primary` | 待处理 / 需关注(品牌强调) | `brand` | pending, handoff |

> tone 是有限闭集——**新增状态时只挑 tone,不引入新颜色**。这保证"红永远是危险,绿永远是正常"。

**状态色是语义,不是装饰**:视觉升级 / 白标换肤 / 中性色调整都**不动**这五个 status token 的值——「活泼加在不承载状态语义的地方」(见 [`principles.md`](./principles.md) §1)。品牌色相与全部 status 色相拉开 ≥20°;身份渐变(头像色)不受本系统的色彩预算约束,但**色板必须避开 status 色相区 ±20°**,否则绿头像会被误读成「在线」。

---

## 3. 数据结构

```ts
export type StatusTone =
  | 'success' | 'warning' | 'destructive' | 'info' | 'muted' | 'primary'

export interface StatusDef {
  i18nKey: string   // status.* 命名空间下的 i18n key
  fallback: string  // i18n 未就绪时的回退文案
  tone: StatusTone
  note?: string     // 开发者注释,不渲染
}
```

tone → class(整套色 class 集中在此,ESLint `no-hardcoded-color` 只豁免本文件):

```ts
export const TONE_BADGE_CLASS: Record<StatusTone, string> = {
  success:     'bg-status-success/10 text-status-success border-status-success/30 dark:bg-status-success/20',
  warning:     'bg-status-warning/10 text-status-warning border-status-warning/30 dark:bg-status-warning/20',
  destructive: 'bg-status-destructive/10 text-status-destructive border-status-destructive/30 dark:bg-status-destructive/20',
  info:        'bg-status-info/10 text-status-info border-status-info/30 dark:bg-status-info/20',
  muted:       'bg-status-muted/10 text-status-muted border-status-muted/30 dark:bg-status-muted/20',
  primary:     'bg-brand/10 text-brand border-brand/30',
}
export const TONE_DOT_CLASS: Record<StatusTone, string> = {
  success: 'bg-status-success', warning: 'bg-status-warning',
  destructive: 'bg-status-destructive', info: 'bg-status-info',
  muted: 'bg-status-muted', primary: 'bg-brand',
}
```

---

## 4. 域表(domain tables)与查找

每个业务域一张 `Record<string, StatusDef>` 表。`statusMap.ts` 自带通用示例(`ENTITY_STATUS` / `HEALTH_STATUS` / `EVENT_SEVERITY` / `WS_STATUS`),**团队按自己业务追加**。

```ts
export const HEALTH_STATUS: Record<string, StatusDef> = {
  ok:       { i18nKey: 'status.health.ok',       fallback: '正常', tone: 'success' },
  degraded: { i18nKey: 'status.health.degraded', fallback: '降级', tone: 'warning' },
  down:     { i18nKey: 'status.health.down',     fallback: '故障', tone: 'destructive' },
}
```

**综合查找** `resolveStatus(key)` 只链**键不冲突**的域表(见 `statusMap.ts`):

```ts
// EVENT_SEVERITY.warning 与 ENTITY_STATUS.warning 撞键 → 不进全局链
export function resolveStatus(key: string): StatusDef | undefined {
  return ENTITY_STATUS[key] ?? WS_STATUS[key]
}
```

### ⚠ 键冲突:用域专用 resolver

不同域可能复用同一字符串键(`statusMap.ts` 里 `EVENT_SEVERITY.warning` 就与 `ENTITY_STATUS.warning` 撞键;实战里 `banned` 在"账号"是封号、在"群"是不可达)。**键会碰撞的域,不要进全局 `resolveStatus` 链,单列专用 resolver**:

```ts
// 事件级别显式查本表,避免被全局链先命中 ENTITY 的 'warning'(给出错误文案)
export function resolveSeverity(level: string): StatusDef {
  return EVENT_SEVERITY[level] ?? { i18nKey: 'status.unknown', fallback: level, tone: 'muted' }
}
```

> 实战经验:多个域专用 resolver(如事件级别、群状态、补号状态、失败原因)都因 `warning`/`banned`/`pending`/`failed` 跨域撞键而独立出来。

---

## 5. 渲染:`<StatusBadge>`

组件层只认 status key,颜色与文案都由 statusMap 决定(详见 [`components.md`](./components.md)):

```tsx
<StatusBadge status="failed" />                              // 全局 resolve
<StatusBadge status={ev.level} resolver={resolveSeverity} /> // 域专用(撞键域)
```

`StatusBadge` 内部:`resolve(status)` → `TONE_BADGE_CLASS[def.tone]` 上色 → `t(def.i18nKey, def.fallback)` 出文案。**组件里不出现任何颜色字面量**。

---

## 6. 约束与红旗

- **MUST**:任何状态色经由 statusMap。组件里 `bg-red-*` / `text-green-*` 一律 ESLint 拒(`no-hardcoded-color`)。
- **MUST**:新状态先挑 tone,不加新颜色。
- **MUST**:跨域撞键 → 专用 resolver,不塞全局链。
- **MUST**:`statusMap.ts` 是 `no-hardcoded-color` 与 `i18next/no-literal-string` 的**唯一豁免文件**(它就是色与 fallback 文案的指定源)。
- **红旗**:组件里出现 `Record<..., string>` 形式的内联 `{ high: 'bg-red-...' }` 颜色 map → 立即收敛进 statusMap。
- **红旗**:status 文案直接写中文(不走 i18nKey)→ 违 i18n 约束。

---

## 7. 扩展指引(团队接入)

1. 拷 `assets/statusMap.ts` 进项目 `src/lib/`。
2. 按业务把状态登记进对应域表(或新建域表),每条挑 tone + 配 i18nKey。
3. 撞键的域加专用 `resolveXxxStatus`。
4. i18n 文件补 `status.*` key(fallback 仅过渡用)。
5. 全程用 `<StatusBadge>` 渲染,绝不在组件写色。
