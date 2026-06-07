/**
 * AuthContext (Kapibala_Design_Admin)
 *
 * 持有 user + 权限集 (+ 可扩展 activeTeam)。提供 useHasPermission。
 * 无 Provider 时优雅降级为空权限集 —— 便于隔离测试 PermissionGate。
 * 前端门控 ≠ 鉴权: 这里只决定 UI 显隐, 后端 middleware 才是权威。
 */
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  name: string
  permissions: string[]
}

interface AuthContextValue {
  user: AuthUser | null
  permissions: Set<string>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  user,
  children,
}: {
  user: AuthUser | null
  children: ReactNode
}) {
  const value = useMemo<AuthContextValue>(
    () => ({ user, permissions: new Set(user?.permissions ?? []) }),
    [user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  // 无 Provider → 空权限集, 不抛错 (隔离测试友好)
  return useContext(AuthContext) ?? { user: null, permissions: new Set<string>() }
}

/** 判定函数: has('group.read') -> boolean */
export function useHasPermission(): (key: string) => boolean {
  const { permissions } = useAuth()
  return useCallback((key: string) => permissions.has(key), [permissions])
}
