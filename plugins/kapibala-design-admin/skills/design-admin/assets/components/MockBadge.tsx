/**
 * MockBadge —— 演示数据标记 (承载「后端缺口显式化」)。
 * 用占位/演示数据时必须挂可见标记, 不让 mock 冒充真数据。
 * 颜色经 status-warning 语义 token, 不写字面色。
 * 详见 ../../references/components.md §3.5。
 */
import { useTranslation } from 'react-i18next'

export function MockBadge() {
  const { t } = useTranslation()
  return (
    <span className="rounded bg-status-warning/10 px-1.5 py-0.5 text-xs text-status-warning">
      {t('common.mock', '演示 · 待对接')}
    </span>
  )
}
