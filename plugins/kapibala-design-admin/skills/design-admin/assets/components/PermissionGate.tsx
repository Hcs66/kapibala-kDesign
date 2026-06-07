/**
 * PermissionGate —— 前端权限门控 (承载权限纪律)
 *
 * 权限相关 UI 必须包本组件或用 useHasPermission(); 禁止 role === 'admin' (ESLint 卡)。
 * 前端门控只隐藏 UI, 不是鉴权 —— 后端 middleware 才是权威。
 * 详见 ../../references/components.md §3.2。
 */
import type { ReactNode } from 'react'
import { useHasPermission } from '@/contexts/AuthContext'

interface PermissionGateProps {
  permission: string | string[]
  /** 多个 key 时: 全满足 / 任一满足 */
  mode?: 'all' | 'any'
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({
  permission,
  mode = 'all',
  fallback = null,
  children,
}: PermissionGateProps) {
  const has = useHasPermission()
  const keys = Array.isArray(permission) ? permission : [permission]
  const ok = mode === 'all' ? keys.every(has) : keys.some(has)
  return <>{ok ? children : fallback}</>
}
