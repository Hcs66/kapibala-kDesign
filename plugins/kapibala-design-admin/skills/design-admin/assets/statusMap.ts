/**
 * 状态语义色映射 · 唯一映射表 (Kapibala_Design_Admin)
 *
 * 任何徽章/状态点颜色都必须查这张表 —— 不允许在组件里写字面 Tailwind 调色板色。
 * ESLint `no-hardcoded-color` 强制; 本文件是该规则 + i18next/no-literal-string 的唯一豁免文件。
 *
 * 机制: 业务状态字符串 → StatusDef{tone} → TONE_BADGE_CLASS[tone] → <StatusBadge>。
 * 团队按自己业务在「域表」区追加 Record<string, StatusDef>; 撞键的域单列专用 resolver。
 *
 * 详见 ../references/status-system.md。
 */

export type StatusTone =
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'
  | 'muted'
  | 'primary'

export interface StatusDef {
  /** i18n key (status.* 命名空间) */
  i18nKey: string
  /** i18n 未就绪时的回退文案 */
  fallback: string
  tone: StatusTone
  /** 开发者注释, 不渲染 */
  note?: string
}

/* ─────────────── tone → Tailwind className ───────────────
 * 全部色 class 集中在此两处, 把 no-hardcoded-color 的豁免锁在本文件。 */
export const TONE_BADGE_CLASS: Record<StatusTone, string> = {
  success:
    'bg-status-success/10 text-status-success border-status-success/30 dark:bg-status-success/20',
  warning:
    'bg-status-warning/10 text-status-warning border-status-warning/30 dark:bg-status-warning/20',
  destructive:
    'bg-status-destructive/10 text-status-destructive border-status-destructive/30 dark:bg-status-destructive/20',
  info: 'bg-status-info/10 text-status-info border-status-info/30 dark:bg-status-info/20',
  muted:
    'bg-status-muted/10 text-status-muted border-status-muted/30 dark:bg-status-muted/20',
  primary: 'bg-brand/10 text-brand border-brand/30',
}

export const TONE_DOT_CLASS: Record<StatusTone, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  destructive: 'bg-status-destructive',
  info: 'bg-status-info',
  muted: 'bg-status-muted',
  primary: 'bg-brand',
}

/* ═══════════════ 域表 (示例 —— 团队按业务替换/追加) ═══════════════ */

/**
 * 通用实体状态 —— 大多数 CRUD 实体 (账号/任务/订单...) 的启用态。
 * 撞键风险低, 进全局 resolveStatus 链。
 */
export const ENTITY_STATUS: Record<string, StatusDef> = {
  active: { i18nKey: 'status.entity.active', fallback: '启用', tone: 'success' },
  inactive: { i18nKey: 'status.entity.inactive', fallback: '停用', tone: 'muted' },
  pending: { i18nKey: 'status.entity.pending', fallback: '待处理', tone: 'primary' },
  processing: {
    i18nKey: 'status.entity.processing',
    fallback: '处理中',
    tone: 'info',
  },
  warning: { i18nKey: 'status.entity.warning', fallback: '警示', tone: 'warning' },
  failed: { i18nKey: 'status.entity.failed', fallback: '失败', tone: 'destructive' },
  archived: { i18nKey: 'status.entity.archived', fallback: '已归档', tone: 'muted' },
}

/** 系统健康 (健康卡片) */
export const HEALTH_STATUS: Record<string, StatusDef> = {
  ok: { i18nKey: 'status.health.ok', fallback: '正常', tone: 'success' },
  degraded: { i18nKey: 'status.health.degraded', fallback: '降级', tone: 'warning' },
  down: { i18nKey: 'status.health.down', fallback: '故障', tone: 'destructive' },
}

/** 事件级别 —— 'warning' 与 ENTITY_STATUS 撞键, 故不进全局链, 用 resolveSeverity 专查。 */
export const EVENT_SEVERITY: Record<string, StatusDef> = {
  info: { i18nKey: 'status.severity.info', fallback: '信息', tone: 'info' },
  warning: { i18nKey: 'status.severity.warning', fallback: '警告', tone: 'warning' },
  error: { i18nKey: 'status.severity.error', fallback: '错误', tone: 'destructive' },
}

/** WebSocket 连接态 (AppShell 指示灯) */
export const WS_STATUS: Record<string, StatusDef> = {
  online: { i18nKey: 'status.ws.online', fallback: '已连接', tone: 'success' },
  reconnecting: {
    i18nKey: 'status.ws.reconnecting',
    fallback: '重连中',
    tone: 'warning',
  },
  offline: { i18nKey: 'status.ws.offline', fallback: '已断开', tone: 'destructive' },
}

/* ═══════════════ 查找 ═══════════════ */

/**
 * 综合查找: 只链「键不冲突」的域表。
 * ⚠ 撞键的域不要塞进这条链 —— EVENT_SEVERITY.warning 与 ENTITY_STATUS.warning
 *    撞键, 若并入会被 ENTITY 先命中、给出错误文案; 故 EVENT_SEVERITY 单列
 *    resolveSeverity。HEALTH_STATUS 虽不撞键, 也示范用专用 resolver 显式锁定。
 */
export function resolveStatus(key: string): StatusDef | undefined {
  return ENTITY_STATUS[key] ?? WS_STATUS[key]
}

const UNKNOWN = (raw: string): StatusDef => ({
  i18nKey: 'status.unknown',
  fallback: raw,
  tone: 'muted',
})

/** 事件级别专用 (与 ENTITY 撞键, 不进全局链)。带兜底。 */
export function resolveSeverity(level: string): StatusDef {
  return EVENT_SEVERITY[level] ?? UNKNOWN(level)
}

/**
 * 域专用 resolver 范例 —— 当某域的键你想显式锁定、不受全局链顺序影响时这样写。
 * 带兜底, 未登记状态回落 muted + 原文。
 */
export function resolveHealthStatus(status: string): StatusDef {
  return HEALTH_STATUS[status] ?? UNKNOWN(status)
}
