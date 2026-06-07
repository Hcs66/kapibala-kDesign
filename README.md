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

## 怎么用(给队友)

它是什么:让 Claude 按本团队管理后台标准产出代码的 skill —— 语义 design token、statusMap 状态色、i18n、权限门控、logger、React Query/adapter 数据层,外加一套可直接拷的落地物。

**多数时候你什么都不用做。** 在管理后台项目里正常用自然语言提需求(「加个账号列表页,带状态徽章和权限按钮」),skill 会自动加载并按标准生成。想确认它在不在:对话里敲 `/` 看有没有 `/kapibala-design-admin:design-admin`,或 `claude plugin list`。

### 零感知接入(推荐,团队 lead 做一次)

在**消费项目**里装一次并提交:

```
claude plugin install kapibala-design-admin@kapibala-plugins --scope project
```

写进项目 `.claude/settings.json` 后,**任何人 clone 该项目、开 Claude Code 即自动带上**,无需各自安装、也不必知道这个 skill 存在。

### 新项目:首次落地

让 Claude 把落地物拷进来:

```
按 design-admin 的落地步骤,把 assets 拷进本项目对应位置。
```

它会照 `SKILL.md` §0.5 放好 `globals.css` / `statusMap.ts` / `logger.ts` / 共享组件 / locale 等,并提示先 `npx shadcn add button skeleton`。

### 已有项目:对照重构

**别一句「帮我重构」一把梭。** 把下面这段作为第一句(填上 Tailwind 版本):

```
这个项目要接入 design-admin 标准。先别改代码:
1. 对照红旗信号审计现状,列出违规清单(硬编码色/未走 statusMap/裸 console/
   role==='admin'/硬编码文案/缺 adapter 层等),标出文件和影响面;
2. 给一个分步迁移计划(先接地基 token+statusMap+logger+ESLint,再按模块增量迁移)。
注意:我用 Tailwind v4(或 v3),已有 globals.css 和 eslint.config.js,
落地要合并不要覆盖;每步先说改哪些文件、等我确认再动。
```

拿到清单和计划后,逐步推进(`按计划第 1 步接地基,合并现有配置` / `把「账号管理」模块迁到 statusMap`)。要点:**先审计、要计划、逐步确认**,ESLint 接上后新代码会被自动卡住,存量慢慢清。

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
