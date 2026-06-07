# kapibala-kDesign

Kapibala 团队 **Web 管理后台前端设计与工程标准**,以 **Claude Code 插件(plugin + skill)** 形式分发。

技术栈基线:React 18+ · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix。

本仓库既是**插件市场(marketplace)**,也是该插件的**唯一真相源**。

## 安装(团队成员)

在 Claude Code 里:

```
/plugin marketplace add Hcs66/kapibala-kDesign
/plugin install kapibala-design-admin@kapibala-plugins
```

装好后,在管理后台项目里构建 / 修改前端时,skill `design-admin` 会按描述**自动加载**为 context;也可手动触发:

```
/kapibala-design-admin:design-admin
```

> 想让全队随项目自动获得,可用 `claude plugin install kapibala-design-admin@kapibala-plugins --scope project`,把安装写进项目 `.claude/settings.json`。

## 仓库结构

```
.claude-plugin/marketplace.json            ← 市场清单(指向下面的插件)
plugins/kapibala-design-admin/
├─ .claude-plugin/plugin.json              ← 插件清单
└─ skills/design-admin/
   ├─ SKILL.md                             ← 入口:硬约束 / 红旗信号 / 导航 / 落地步骤
   ├─ references/                          ← 规范分册(按需加载)
   │  ├─ principles.md  tokens.md  status-system.md
   │  └─ components.md  conventions.md  rationale.md
   └─ assets/                              ← 可直接拷进消费项目的落地物
      ├─ globals.css  tailwind.config.ts  eslint.config.js  components.json
      ├─ lib/        cn.ts  logger.ts
      ├─ statusMap.ts
      ├─ contexts/   AuthContext.tsx
      ├─ components/ StatusBadge / PermissionGate / QueryState / EmptyState / MockBadge / ErrorBoundary
      └─ i18n/locales/  zh-CN.json  en.json
```

## 规范导航

入口:[`SKILL.md`](./plugins/kapibala-design-admin/skills/design-admin/SKILL.md)

| 分册 | 内容 |
|---|---|
| [`principles.md`](./plugins/kapibala-design-admin/skills/design-admin/references/principles.md) | 设计哲学 / 视觉语言 / 字号层级 / 布局栅格 |
| [`tokens.md`](./plugins/kapibala-design-admin/skills/design-admin/references/tokens.md) | Design token 全量(OKLCH + HSL 对照)/ 命名 / 白标 |
| [`status-system.md`](./plugins/kapibala-design-admin/skills/design-admin/references/status-system.md) | ⭐ 状态语义色系统(核心差异化资产) |
| [`components.md`](./plugins/kapibala-design-admin/skills/design-admin/references/components.md) | shadcn 原语 + 必备共享组件 + 应用骨架 |
| [`conventions.md`](./plugins/kapibala-design-admin/skills/design-admin/references/conventions.md) | 目录 / 命名 / i18n / 数据层 / 日志 / ESLint |
| [`rationale.md`](./plugins/kapibala-design-admin/skills/design-admin/references/rationale.md) | 取舍来由 + 历史教训(背景,非生成时必读) |

## 维护

改完插件内容后,本地验证清单:

```
claude plugin validate .                                  # marketplace.json
claude plugin validate ./plugins/kapibala-design-admin    # plugin.json
```

`SKILL.md` 与 `assets/` 是同一标准的两面(prose 与可执行物),改一处要同步另一处。改 `references/` 分册的硬约束、token 名或状态色集时,务必同步对应的 `assets/` 文件(`statusMap.ts` / `globals.css` / `eslint.config.js`)。
