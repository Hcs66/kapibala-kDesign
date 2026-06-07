/**
 * StatusBadge —— 状态徽章 (承载状态色系统)
 *
 * 铁律: 颜色只来自 TONE_BADGE_CLASS, 文案只来自 t(def.i18nKey)。
 * 组件里不出现任何色字面量。撞键域传专用 resolver (如 resolveSeverity)。
 * 详见 ../../references/status-system.md。
 */
import { cn } from '@/lib/cn'
import { useTranslation } from 'react-i18next'
import {
  resolveStatus,
  TONE_BADGE_CLASS,
  TONE_DOT_CLASS,
  type StatusDef,
} from '@/lib/statusMap'

interface StatusBadgeProps {
  status: string
  /** 撞键域传专用 resolver, 默认走全局 resolveStatus */
  resolver?: (s: string) => StatusDef | undefined
  withDot?: boolean
  className?: string
}

export function StatusBadge({
  status,
  resolver = resolveStatus,
  withDot,
  className,
}: StatusBadgeProps) {
  const { t } = useTranslation()
  const def = resolver(status) ?? {
    i18nKey: 'status.unknown',
    fallback: status,
    tone: 'muted' as const,
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        TONE_BADGE_CLASS[def.tone],
        className,
      )}
    >
      {withDot && <span className={cn('size-1.5 rounded-full', TONE_DOT_CLASS[def.tone])} />}
      {t(def.i18nKey, def.fallback)}
    </span>
  )
}
