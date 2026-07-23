/**
 * 白标 (white-label) 配置 · 部署期环境变量 (Kapibala_Design_Admin)
 *
 * 来源:
 *  - VITE_PRODUCT_NAME       产品名 (硬约束 10: 禁止 hardcode 品牌词)
 *  - VITE_PRODUCT_LOGO_URL   Logo URL, 留空则隐藏
 *  - VITE_PRIMARY_COLOR      主题色 (HEX), 启动时写入 :root --brand / --brand-2
 *
 * 机制: globals.css 里 --primary / --ring 都 = var(--brand), 覆盖 --brand
 * 即换掉所有主按钮、focus ring、primary tone 徽章。--brand-2 (渐变终点)
 * 永远由 brand 按固定偏移派生, 不接受独立配置 —— 否则白标客户会拿到
 * 「自定义主色 + 固定默认紫」的怪组合 (双写入点漂移)。
 *
 * ⚠ 默认品牌色的「真源」是部署期环境变量, 不是 CSS 里的默认值 —— 改默认
 * 品牌色时 .env.example 必须同步, 否则运行时仍是旧色 (实战踩坑, 见
 * ../../references/rationale.md)。建议加测试钉住 .env 与 globals.css 不漂移。
 *
 * Tailwind v4 (主基线): CSS 变量存完整颜色值, 直接写 HEX / hsl() 即可
 * (alpha 修饰符走 color-mix, 任意颜色格式都支持)。
 * Tailwind v3: --brand 必须存 "H S% L%" 裸分量 (config 用
 * hsl(var(--brand) / <alpha-value>) 引用), 改用 hexToHslComponents 的输出。
 *
 * 详见 ../../references/tokens.md §白标。
 */

import { logger } from './logger'

export interface WhiteLabelConfig {
  productName: string
  logoUrl: string | null
  primaryColor: string
}

const DEFAULTS: WhiteLabelConfig = {
  // 占位 —— 接入项目改成自家默认品牌 (与 .env.example 保持一致)
  productName: 'Admin',
  logoUrl: null,
  primaryColor: '#4F46E5',
}

const DEFAULT_BRAND_HSL = '243 75% 59%' // ≈ #4F46E5

/** brand-2 (渐变终点) 相对 brand 的固定偏移。#4F46E5 → #8B5CF6 实测差值。 */
const BRAND_2_HUE_SHIFT = 19
const BRAND_2_SAT_SHIFT = 8
const BRAND_2_LIGHT_SHIFT = 7

export function getWhiteLabel(): WhiteLabelConfig {
  return {
    productName: import.meta.env.VITE_PRODUCT_NAME ?? DEFAULTS.productName,
    logoUrl: import.meta.env.VITE_PRODUCT_LOGO_URL || DEFAULTS.logoUrl,
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR ?? DEFAULTS.primaryColor,
  }
}

/**
 * "#RRGGBB" / "#RGB" → "H S% L%" 裸分量。HEX 非法时回退默认品牌色。
 */
export function hexToHslComponents(hex: string): string {
  const clean = hex.trim().replace(/^#/, '')
  if (clean.length !== 3 && clean.length !== 6) {
    logger.warn('[whitelabel] invalid VITE_PRIMARY_COLOR hex, falling back:', hex)
    return DEFAULT_BRAND_HSL
  }
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    logger.warn('[whitelabel] non-hex VITE_PRIMARY_COLOR, falling back:', hex)
    return DEFAULT_BRAND_HSL
  }

  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * 由 brand 派生 brand-2 (渐变终点)。输入/输出都是 "H S% L%" 分量串。
 * 解析失败时退化成同色 (渐变视觉上=纯色), 比抛错或乱色安全。
 */
export function deriveBrand2(brandHsl: string): string {
  const m = /^\s*(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%\s*$/.exec(brandHsl)
  if (!m) {
    logger.warn('[whitelabel] cannot parse brand HSL for brand-2 derivation:', brandHsl)
    return brandHsl
  }
  const h = (Number(m[1]) + BRAND_2_HUE_SHIFT + 360) % 360
  const s = Math.min(100, Number(m[2]) + BRAND_2_SAT_SHIFT)
  const l = Math.min(100, Number(m[3]) + BRAND_2_LIGHT_SHIFT)
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`
}

/**
 * 启动时调用 (main.tsx, render 之前): 把白标主色写入 :root。
 *
 * v4 (默认): 变量存完整颜色值 → 写 hsl(...) 包裹形式。
 * v3: 变量存裸分量 → 把下面两行改成写 `hsl` / `hsl2` 本身 (去掉包裹)。
 */
export function applyWhiteLabelTheme(config: WhiteLabelConfig = getWhiteLabel()) {
  const hsl = hexToHslComponents(config.primaryColor)
  const hsl2 = deriveBrand2(hsl)
  document.documentElement.style.setProperty('--brand', `hsl(${hsl})`)
  document.documentElement.style.setProperty('--brand-2', `hsl(${hsl2})`)
}
