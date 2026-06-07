# 工程约定(Conventions)

> 目录、命名、i18n、数据层、日志、ESLint 的硬约定。多数由 ESLint 强制(CI / PR review 卡)。

---

## 1. 目录结构

```
src/
├─ adapters/      后端 DTO → ViewModel 转换 (唯一可 import type @backend 的层)
├─ components/    ui/ (shadcn) + shell/ (骨架) + 共享组件
├─ config/        menu.ts (导航单源) 等集中配置
├─ contexts/      React Context (AuthContext: user + permissions + activeTeam)
├─ hooks/         通用自定义 hook
├─ i18n/          index.ts + locales/{zh-CN,en}.json
├─ lib/           apiClient / wsClient / logger / statusMap / cn / queryClient ...
├─ mocks/         占位数据 (VITE_USE_REAL_API flag 切真假)
├─ pages/         路由页面, 按模块分目录; 页面专属子组件就近放
├─ queries/       React Query: keys.ts (key 工厂) + useXxx hooks
├─ styles/        globals.css (token + base)
├─ App.tsx        路由定义 (lazy)
└─ main.tsx       入口: QueryClientProvider → AuthProvider → App
```

要点:
- **页面专属组件就近放** `pages/<模块>/`,只有跨页复用才升到 `components/`。
- **路径别名 `@/` → `src/`**(vite + tsconfig 配)。
- **路由 lazy 加载**,配合根/路由级 Suspense + ErrorBoundary。

---

## 2. 命名

| 对象 | 规则 | 例 |
|---|---|---|
| 组件文件/导出 | PascalCase | `GroupsPage.tsx` |
| hook | camelCase, `use` 前缀 | `useAccounts.ts` |
| 工具/普通模块 | camelCase | `apiClient.ts` |
| 类型/接口 | PascalCase, props 用 `XxxProps` | `StatusBadgeProps` |
| 常量 map | UPPER_SNAKE | `TONE_BADGE_CLASS` |
| i18n key | 点分命名空间小写 | `status.account.online` |

---

## 3. i18n(MUST)

- 库:**i18next + react-i18next**,默认 `zh-CN`,支持 `en`,localStorage 持久化语言选择。
- **所有用户可见文案走 `t('key')`**,JSX 里禁止硬编码中/英文(ESLint `i18next/no-literal-string`,jsx-only 模式)。
- key 命名:`<域>.<子域>.<名>`,如 `menu.dashboard` / `common.ok` / `status.health.down` / `pages.groups.title`。
- 两份 locale 文件结构必须**一致**(漏 key 回退到默认语言)。
- **豁免**(ESLint 不卡):`src/components/ui/**`(vendored 原语)、`src/i18n/**`、`statusMap.ts`(指定 fallback 源)、测试文件。
- 属性豁免:`className` `style` `href` `id` `type` `aria-*` `data-*` 以及枚举型属性(`variant` `size` `tone` `status` `permission` `i18nKey` 等)——它们是枚举值不是文案。

---

## 4. 数据层(MUST)

### 4.1 React Query
- 服务端数据**一律走 React Query**,不用 `useEffect + setState` 手撸 fetch。
- **key 集中在 `queries/keys.ts`**(工厂对象),避免散落字符串拼接。
- mutation 改写后用 **`invalidateQueries`**,**禁止 `setQueryData`** 手动塞缓存(防 cache 与 server 漂移)。
- 全局 `staleTime` 建议 30s;WS 重连后 `refetchQueries` 回填。

```ts
// queries/keys.ts
export const queryKeys = {
  groups: { all: ['groups'] as const, detail: (id: string) => ['groups', id] as const },
  accounts: { all: ['accounts'] as const },
}
```

### 4.2 Adapter 层(后端契约接缝)
- 后端 DTO 类型**只能在 `src/adapters/**` 内 `import type`**(build 时擦除,不把后端运行时拖进 bundle)。
- 组件/hook **只见 ViewModel**,不直接 import 后端类型(ESLint `no-restricted-imports` 卡)。
- 每个域:`adapters/<域>.ts` 提供 `toXxx(raw): Xxx` 转换。

### 4.3 Mock / Real 切换
- `VITE_USE_REAL_API=0` 用 mock(默认开发),`=1` 用真接口。
- 占位数据**显式标记**(`MockBadge`「演示 · 待对接」),不让 mock 冒充真数据。
- 前端能力受后端限制时,优先用既有端点 / 前端兜底 / 占位,把后端缺口**显式留待对接**,不擅自扩后端。

---

## 5. 日志与错误(MUST)

- **统一 `src/lib/logger.ts`** 是唯一 console sink(内部一行 `console[level]` 用 inline disable 豁免),其余文件**禁止裸 `console.*`**(ESLint `no-console`)。
- logger 维护环形缓冲(便于将来 `/api/logs` 落地上报)。
- **silent catch 零容忍**:`} catch {}` 0 log 禁止。
  - catch 前**有副作用**(已入队/已发送/已写 UI state)→ `logger.error` + 上报。
  - catch 前无副作用 → 至少 `logger.warn`。
- **跨 try/catch 边界引用的变量**(被 catch 闭包 / setTimeout / Promise.then 引用)必须**提升到外层函数作用域**,否则 `ReferenceError`(真实事故教训)。

---

## 6. ESLint 规则集(MUST,本目录 `eslint.config.js` 提供)

完整配置见 [`eslint.config.js`](../assets/eslint.config.js)。核心设计规则:

| 规则 | 作用 |
|---|---|
| `no-hardcoded-color`(自定义) | 禁字面 Tailwind 调色板色(`bg-red-500` 等),逼走 statusMap |
| `i18next/no-literal-string` | 禁 JSX 硬编码文案,逼走 i18n |
| `no-restricted-syntax`(role) | 禁 `role === 'admin'` 字面比较,逼走 PermissionGate |
| `no-restricted-syntax`(brand) | 禁 hardcode 产品名/品牌词,逼走 env / i18n |
| `no-restricted-imports`(@backend) | 后端类型只能在 adapters 内 import type |
| `no-console` | 禁裸 console,逼走 logger |
| `@typescript-eslint/no-shadow`(关掉基础 `no-shadow`) | 禁变量遮蔽;用 TS 版避免枚举/类型声明的误报 |
| `react-hooks/rules-of-hooks` + `exhaustive-deps` | hook 正确性 |
| `@typescript-eslint/no-unused-vars`(`^_` 豁免) | 死代码 |

`src/components/ui/**`(shadcn 原语)放宽:关 `no-restricted-syntax` + `react-refresh`。

---

## 7. 测试(MUST,随 PR 提交)

前端测试**随业务 PR 一起提交并持续维护**(与某些后端"测试本地验证后删除"的纪律不同):

- **unit / component**:vitest + @testing-library/react(jsdom)。
- **e2e**:playwright,覆盖主线流程。
- `PermissionGate` / `useHasPermission` 在无 Provider 时**优雅降级**(空权限集),便于隔离测试。
- 不带测试的 `web` 前端 PR = CI 卡。

---

## 8. 提交前自检(grep 红旗)

```bash
# 字面色
grep -rnE '(bg|text|border|ring)-(red|green|amber|yellow|blue|indigo|...)-(50|100|...|950)' src/
# 裸 console
grep -rn 'console\.' src/ | grep -v 'lib/logger'
# role 字面比较
grep -rn "role === 'admin'" src/
# 手动塞缓存
grep -rn 'setQueryData' src/
# 后端直引
grep -rn "from '@backend" src/ | grep -v 'src/adapters/'
# silent catch
grep -rnA2 'catch' src/ | grep -B1 '}' # 人工核对有无 logger
```
任一命中 → 对照本篇约束修掉再提交。
