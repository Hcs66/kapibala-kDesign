/**
 * cn() — 合并 className 的标准工具 (Kapibala_Design_Admin)
 * clsx 处理条件 class, tailwind-merge 消解冲突 (后者覆盖前者)。
 * 所有组件用它合并 class, 不要手动拼字符串。
 *
 *   依赖: npm i clsx tailwind-merge
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
