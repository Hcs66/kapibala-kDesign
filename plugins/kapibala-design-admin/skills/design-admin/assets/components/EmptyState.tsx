/**
 * EmptyState —— 空态。标题/描述走 i18n key。
 *
 * 图标用品牌光晕徽章而非半透明灰线条: 空态是新用户和低频页面的第一印象,
 * 淡灰大图标读起来像「这里坏了」, 而不是「这里还没开始」。光晕走 brand token,
 * 亮暗自适应。文案建议写「会发生什么」(如「任务跑起来后结果会出现在这里」),
 * 并尽量给一个明确的下一步 action。
 *
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
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      {Icon && (
        <div
          aria-hidden
          className="grid size-16 place-items-center rounded-2xl bg-brand/[0.07] text-brand ring-1 ring-inset ring-brand/15"
        >
          <Icon size={28} strokeWidth={1.75} />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{t(titleKey)}</p>
        {descKey && <p className="text-xs text-muted-foreground max-w-xs">{t(descKey)}</p>}
      </div>
      {action}
    </div>
  )
}
