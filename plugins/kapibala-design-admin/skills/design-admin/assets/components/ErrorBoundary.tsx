/**
 * ErrorBoundary / ErrorFallback (Kapibala_Design_Admin)
 *
 * 根级包整个 App; 路由级每个 lazy 页面外再包一层 (配 Suspense)。
 * 铁律: 捕获错误必 logger.error 上报, 禁止静默 (约束 7)。
 * 详见 ../../references/components.md §3.6。
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

export function ErrorFallback({ onReset }: { onReset?: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm text-muted-foreground">{t('common.errorBoundary', '页面出错了')}</p>
      {onReset && (
        <Button variant="outline" size="sm" onClick={onReset}>
          {t('common.retry', '重试')}
        </Button>
      )}
    </div>
  )
}

interface Props {
  fallback?: ReactNode
  children: ReactNode
}
interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 禁止静默: 错误边界必须上报
    logger.error('[ErrorBoundary]', error, info.componentStack)
  }

  private reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback onReset={this.reset} />
    }
    return this.props.children
  }
}
