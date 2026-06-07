/**
 * EmptyState —— 空态。标题/描述走 i18n key。
 * 详见 ../../references/components.md §3.4。
 */
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  icon?: LucideIcon
  titleKey: string
  descKey?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, titleKey, descKey, action }: EmptyStateProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon className="size-10 text-muted-foreground" aria-hidden />}
      <p className="text-sm font-medium text-foreground">{t(titleKey)}</p>
      {descKey && <p className="text-sm text-muted-foreground">{t(descKey)}</p>}
      {action}
    </div>
  )
}
