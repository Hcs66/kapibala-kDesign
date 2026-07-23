/**
 * 身份渐变 (identity gradient) — 按实体 ID 稳定地取一个渐变色 (Kapibala_Design_Admin)
 *
 * 用途: 群 / 账号 / 用户 / 客户等实体的头像位。灰底灰字首字母一整列毫无节奏,
 * 是界面「冷淡」最直接的来源之一; 身份渐变让长列表用余光就能认出同一实体。
 *
 * ⚠ 这些颜色**不承载任何语义** —— 纯身份识别, 不表示状态/平台/模式。故:
 *   - 不受 statusMap 色彩预算约束 (那份预算管「状态色只在异常时出现」);
 *   - 但色板必须避开 status 色相区 ±20° (红 2° / 琥珀 35° / 绿 145° / 蓝 210°),
 *     否则绿头像会被误读成「在线」。建议加色相间距断言测试钉住。
 *
 * 渐变定义在 globals.css 的 `.identity-1 … .identity-6`(@layer 之外的裸 CSS,
 * 原因见该文件注释 —— v3 会 purge 动态拼接类名)。
 */

/** 色板容量。改这个数必须同步 globals.css 里的 .identity-N 定义。 */
export const IDENTITY_VARIANTS = 6

/**
 * FNV-1a 32-bit。选它而不是 `id.length % N` 或字符和: 后者对 "group-1" /
 * "group-2" 这种只差末位的 ID 会产生连号, 相邻行拿到相邻色, 看起来像有序分组。
 * FNV 打散得足够均匀。
 */
function hash(id: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** 1 … IDENTITY_VARIANTS, 对同一个 id 恒定。 */
export function identityIndex(id: string): number {
  return (hash(id) % IDENTITY_VARIANTS) + 1
}

/**
 * 返回该实体的身份渐变 class (`identity-1` … `identity-6`)。
 * 空 id 回落到 1 —— 不抛错, 头像是边缘 UI, 不该把页面拖崩。
 */
export function identityGradientClass(id: string | null | undefined): string {
  return `identity-${id ? identityIndex(id) : 1}`
}
