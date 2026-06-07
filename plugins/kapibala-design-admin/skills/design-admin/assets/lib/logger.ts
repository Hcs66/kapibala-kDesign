/**
 * 统一日志 sink (Kapibala_Design_Admin)
 *
 * 全项目唯一允许 console 的地方 —— 其余文件禁裸 console (ESLint no-console),
 * 一律走 logger。维护环形缓冲, 便于将来 /api/logs 落地上报。
 * 禁止 silent catch: catch 前有副作用必 logger.error, 否则至少 logger.warn。
 *
 * 详见 ../../references/conventions.md §5。
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  args: unknown[]
  ts: number
}

const RING_SIZE = 200
const ring: LogEntry[] = []

function record(level: LogLevel, args: unknown[]) {
  ring.push({ level, args, ts: Date.now() })
  if (ring.length > RING_SIZE) ring.shift()
  // 唯一的 console 出口 (本文件是 no-console 的指定豁免点)
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](...args)
}

export const logger = {
  debug: (...args: unknown[]) => record('debug', args),
  info: (...args: unknown[]) => record('info', args),
  warn: (...args: unknown[]) => record('warn', args),
  error: (...args: unknown[]) => record('error', args),
  /** 取环形缓冲快照 (上报 / 调试用) */
  snapshot: (): readonly LogEntry[] => [...ring],
}
