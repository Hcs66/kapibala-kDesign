/**
 * PageHeader —— 全站页头唯一写法。
 *
 * 页头是全站唯一的一级落点 (24px/700): 它若只比正文大几个像素, 扫视时没有
 * 着力点。字阶收敛到本组件, 改一处全站生效; 页面各写各的字号是历史反模式。
 * 每页只有一个 <h1> (本组件渲染), 页内区块标题从 h2 起。
 *
 * 详见 ../../references/components.md §3.5、principles.md §2 字阶表。
 */
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  /** 页面主标题 (已 i18n)。渲染成每页唯一的 <h1>。 */
  title: ReactNode
  /** 标题右侧小挂件 (如 <MockBadge />)。跟着标题走, 不进 actions。 */
  badge?: ReactNode
  /** 标题下方的一行说明 / 统计摘要。 */
  description?: ReactNode
  /** 右上角操作区 (按钮组 / 下拉菜单)。 */
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, badge, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {badge}
        </div>
        {description ? (
          <div className="mt-1 text-sm text-muted-foreground">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
