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
| 视觉语言 | 中性蓝 admin | 玻璃拟态 + AI-tint | 抽成 **可选皮肤** |
| 工程纪律 | ESLint/adapter/i18n/logger 全套 ✅ | 仅 TS 安全 | 取 **全套** |

**一句话**:工程纪律做骨架,设计哲学做皮肤,统一历史上的状态色不一致。

---

## 2. 历史教训(直接抄进标准的反模式)

- **状态色散落**:把 `bg-red-100 text-red-700` 直接写进各 feature 组件,同一"高优先级"在多个文件多种写法。→ 本标准强制 statusMap 单源。
- **silent catch**:`} catch { ... }` 0 log 把运行时异常完全吞掉,线上点击无响应排查数小时(真实事故)。→ 约束 7 零容忍。
- **跨 try/catch 变量作用域**:`try` 块内 `let x`、`catch` 闭包引用 `x` → `ReferenceError`(同上事故)。→ 跨边界引用的变量提升到外层函数作用域。
- **手动塞 query 缓存**:`setQueryData` 后 cache 与 server 漂移。→ 约束 8 用 `invalidateQueries`。
