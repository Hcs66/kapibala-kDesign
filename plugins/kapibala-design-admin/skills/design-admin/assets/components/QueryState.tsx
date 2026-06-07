/**
 * QueryState —— 列表/详情页 loading / error / empty 三态统一包装。
 *
 * 别每页各写各的三态。error 态给重试; empty 态传 <EmptyState>。
 * 依赖 shadcn `button` / `skeleton` (npx shadcn add button skeleton)。
 * 详见 ../../references/components.md §3.3。
 */
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  isEmpty?: boolean
  onRetry?: () => void
  skeleton?: ReactNode
  empty?: ReactNode
  children: ReactNode
}

export function QueryState({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  skeleton,
  empty,
  children,
}: QueryStateProps) {
  const { t } = useTranslation()

  if (isLoading) return <>{skeleton ?? <Skeleton className="h-24 w-full" />}</>

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-muted-foreground">{t('common.loadError', '加载失败')}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t('common.retry', '重试')}
          </Button>
        )}
      </div>
    )
  }

  if (isEmpty) return <>{empty}</>

  return <>{children}</>
}
