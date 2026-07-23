# 组件约定(Components)

> 三层组件体系:**shadcn 原语**(vendored)→ **必备共享组件**(本标准约定)→ **业务组件**(项目自有)。
> 原则:能用 shadcn 就不手搓;能用共享组件就不重复造;业务组件在二者之上组合。

---

## 1. 三层体系

```
src/components/
├─ ui/         shadcn 原语 (vendored, 用 npx shadcn add 生成, 极少改)
├─ shell/      应用骨架 (AppShell / Sidebar / TopBar / Breadcrumb / CmdK ...)
└─ *.tsx       必备共享组件 (StatusBadge / PermissionGate / QueryState ...)
src/pages/**/  业务组件 (页面 + 页面专属子组件就近放)
```

命名:全 PascalCase;后缀语义化(`...Page` / `...Dialog` / `...Sheet` / `...Badge` / `...Form`);props 接口 `XxxProps`。

---

## 2. shadcn 原语(MUST 用这些,别手搓)

用 `npx shadcn@latest add <name>` 生成进 `src/components/ui/`。管理后台常用集:

`button` `input` `textarea` `label` `select` `checkbox` `switch` `radio-group`
`form`(react-hook-form + zod)`dialog` `sheet` `popover` `dropdown-menu` `tooltip`
`tabs` `table` `card` `badge` `avatar` `separator` `skeleton` `scroll-area`
`command`(⌘K)`sonner`(toast)`alert-dialog` `pagination` `breadcrumb`

约定:
- 原语保持 vendored 原样,**ESLint 对 `ui/**` 放宽**(不卡 i18n / no-restricted-syntax,见 conventions §ESLint)。
- 需要变体时改 CVA `variants`,**别 fork 出第二个组件**。
- 所有原语用 `cn()`(`lib/cn.ts`)合并 class。
- **`Card` 加两个 prop**(实战约定):`asChild`(卡片样式套到子元素上,可点击卡片 → `<Card asChild><button>`,不再包一层 div)、`interactive`(hover 抬升 2px + 阴影加深,`duration-base ease-out`)。`interactive` **只给真正可点的卡片**——静态卡片加了会骗人,容器类卡片(表格外壳/表单面板)一律不加。
- `CardTitle` 字阶 `text-base font-semibold tracking-tight`(16px,H2 级,见 principles §2)。

---

## 3. 必备共享组件(本标准要求每个项目都有)

下面是管理后台反复需要、且承载本标准纪律的组件。给出**契约**,实现可按项目微调。

> **已有可直接拷的实现**:`StatusBadge` / `PermissionGate` / `QueryState` / `EmptyState` / `PageHeader` / `MockBadge` / `ErrorBoundary` 以及 `AuthContext`(`useHasPermission`)都在 `../assets/components/`、`../assets/contexts/`。优先拷现成的,下面的契约只是说明各自的铁律。

### 3.1 `StatusBadge` — 状态徽章(承载状态色系统)

```tsx
import { cn } from '@/lib/cn'
import { useTranslation } from 'react-i18next'
import { resolveStatus, TONE_BADGE_CLASS, type StatusDef } from '@/lib/statusMap'

interface StatusBadgeProps {
  status: string
  resolver?: (s: string) => StatusDef | undefined  // 撞键域传专用 resolver
  withDot?: boolean
  className?: string
}

export function StatusBadge({ status, resolver = resolveStatus, withDot, className }: StatusBadgeProps) {
  const { t } = useTranslation()
  const def = resolver(status) ?? { i18nKey: 'status.unknown', fallback: status, tone: 'muted' as const }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium', TONE_BADGE_CLASS[def.tone], className)}>
      {withDot && <span className={cn('size-1.5 rounded-full', `bg-status-${def.tone === 'primary' ? 'info' : def.tone}`)} />}
      {t(def.i18nKey, def.fallback)}
    </span>
  )
}
```

铁律:**颜色只来自 `TONE_BADGE_CLASS`,文案只来自 `t(def.i18nKey)`**。组件里不出现任何色字面量(详见 [`status-system.md`](./status-system.md))。

### 3.2 `PermissionGate` — 前端权限门控(承载权限纪律)

```tsx
interface PermissionGateProps {
  permission: string | string[]   // 需要的权限 key
  mode?: 'all' | 'any'             // 多个 key 时全满足/任一满足
  fallback?: React.ReactNode       // 无权限时渲染 (默认 null)
  children: React.ReactNode
}
export function PermissionGate({ permission, mode = 'all', fallback = null, children }: PermissionGateProps) {
  const has = useHasPermission()   // 来自 AuthContext
  const keys = Array.isArray(permission) ? permission : [permission]
  const ok = mode === 'all' ? keys.every(has) : keys.some(has)
  return ok ? <>{children}</> : <>{fallback}</>
}
```

铁律:权限相关 UI **必须**包 `<PermissionGate>` 或用 `useHasPermission()`,**禁止** `role === 'admin'`(ESLint 卡)。**前端门控只是隐藏 UI,不是鉴权——后端 middleware 才是权威。**

### 3.3 `QueryState` — 加载/错误/空态统一包装

```tsx
interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  isEmpty?: boolean
  onRetry?: () => void
  skeleton?: React.ReactNode      // 自定义骨架, 默认 <Skeleton>
  children: React.ReactNode
}
```

铁律:列表/详情页的三态(loading / error / empty)**走统一组件**,别每页各写各的。error 态给重试按钮,empty 态给 `EmptyState`。

### 3.4 `EmptyState` — 空态

```tsx
interface EmptyStateProps {
  icon?: LucideIcon
  titleKey: string        // i18n key
  descKey?: string
  action?: React.ReactNode
}
```

约定(空态是新用户和低频页面的第一印象,也是最容易「冷」的界面):

- 图标用**品牌光晕徽章**(`bg-brand/[0.07] text-brand` + 内描边),不用半透明大灰图标——那读起来像"这里坏了"而不是"还没开始"。
- 文案写「**会发生什么**」(如"任务跑起来后结果会自动出现在这里"),并区分"无数据" vs "筛选无匹配"。
- 尽量给一个明确的下一步 `action`。

### 3.5 `PageHeader` — 页头(全站唯一写法)

```tsx
interface PageHeaderProps {
  title: ReactNode          // 渲染成每页唯一的 <h1>: text-2xl font-bold tracking-tight
  badge?: ReactNode         // 标题右侧小挂件 (如 <MockBadge/>), 跟标题走, 不进 actions
  description?: ReactNode   // 标题下一行说明/统计摘要 (text-sm text-muted-foreground)
  actions?: ReactNode       // 右上角操作区 (按钮组/下拉)
}
```

铁律:**每页只有一个 `<h1>`**,且只能来自 `PageHeader`;页内区块标题从 h2 起。页头字阶(24px/700)是全站唯一的一级落点,别页面各写各的字号——改一个组件全站生效。

### 3.6 `MockBadge` / `MockNotice` — 演示数据标记(承载"后端缺口显式化")

前端能力领先后端、或用占位数据时,**必须**挂可见标记「演示 · 待对接」,不许让占位数据冒充真数据。

```tsx
export function MockBadge() {
  const { t } = useTranslation()
  return <span className="rounded bg-status-warning/10 text-status-warning text-xs px-1.5 py-0.5">{t('common.mock')}</span>
}
```

### 3.7 `ErrorBoundary` / `ErrorFallback` — 错误边界

- 根级一个(包整个 App),路由级每个 lazy 页面外再包一层 Suspense + Boundary。
- `ErrorFallback` 内**必须** `logger.error` 上报(禁止静默)。

### 3.8 `CopyButton` / `LanguageSwitcher` / `ConfirmDialog`

- `CopyButton`:复制到剪贴板 + 成功 toast。
- `LanguageSwitcher`:切 i18n 语言,写 localStorage。
- `ConfirmDialog`:危险动作二次确认(基于 `alert-dialog`),危险按钮用 `destructive`。

---

## 4. 应用骨架(`shell/`)

标准管理后台外壳,建议每个项目结构一致:

| 组件 | 职责 |
|---|---|
| `AppShell` | 整体布局:侧栏 + 顶栏 + 内容区(`<Outlet/>`),含根 ErrorBoundary + Suspense |
| `Sidebar` | 导航,由 `config/menu.ts` 单一数据源驱动;每项可挂权限 key + `<PermissionGate>` |
| `TopBar` | 顶栏:面包屑 + 全局搜索/⌘K 触发 + 通知铃 + 用户菜单 + 语言切换 |
| `Breadcrumb` | 由 `menu.ts` 的 `resolveRoute(pathname)` 派生,走 i18n key |
| `CmdK` | ⌘K 命令面板(基于 `command`),搜索菜单项 + 快捷动作 |
| `WsStatus` | WebSocket 连接指示灯(走 statusMap 的 `WS_STATUS`) |
| `NotificationBell` | 告警铃 + popover |

**菜单单源**:`config/menu.ts` 一个 `MENU` 数组同时驱动 **侧栏 + 面包屑 + ⌘K 搜索 + 路由权限**。新增页面只改这一处。

```ts
// config/menu.ts 形态
export interface MenuItem {
  id: string
  i18nKey: string          // 标签走 i18n
  path: string
  icon?: LucideIcon
  permission?: string      // 需要的权限 key, 配合 RequirePermission
  children?: MenuItem[]
}
export const MENU: MenuItem[] = [ /* ... */ ]
```

---

## 5. 组件清单速查(写新页面前对照)

| 需求 | 用什么 |
|---|---|
| 页头(标题 + 操作区) | `PageHeader`(每页唯一 h1) |
| 状态展示 | `StatusBadge`(必经 statusMap) |
| 头像底色 | `identityGradientClass(id)`(`lib/identityGradient.ts`,非语义身份色) |
| 权限控制按钮/区块 | `<PermissionGate>` / `useHasPermission()` |
| 列表/详情三态 | `QueryState` + `EmptyState` |
| 危险操作 | `ConfirmDialog`(destructive) |
| 表单 | shadcn `form` + react-hook-form + zod |
| 弹窗 | `dialog`(居中)/ `sheet`(侧滑详情) |
| 占位/演示数据 | `MockBadge` 标记 |
| toast | `sonner` |
| 复制 | `CopyButton` |
| 命令面板 | `CmdK` |
