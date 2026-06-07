/**
 * Tailwind 配置 (Kapibala_Design_Admin)
 *
 * ┌─ Tailwind v4 (本标准主基线) ──────────────────────────────────────┐
 * │ v4 基本不需要这个文件 —— token 全在 globals.css 的 @theme 里。     │
 * │ components.json 的 "tailwind.config" 设为 ""。                      │
 * │ 仅当需要 v4 无法在 CSS 表达的能力 (如自定义 content glob、         │
 * │ 第三方 preset) 时才用本文件; 否则可整个删掉。                       │
 * └────────────────────────────────────────────────────────────────────┘
 */
import type { Config } from 'tailwindcss'

const config: Config = {
  // v4 一般自动探测; 如需手动指定可保留:
  content: ['./index.html', './src/**/*.{ts,tsx}'],
}

export default config

/* ════════════════════════════════════════════════════════════════════
 * v3 项目改造备注 (存量 Tailwind v3 用这套, 不要用上面的 v4 写法)
 * ────────────────────────────────────────────────────────────────────
 * v3 下 token 走 :root HSL 裸分量 + 此处 theme.extend 引用。globals.css
 * 改成 `@tailwind base/components/utilities` + `:root { --brand: 221 83% 53%; ... }`
 * (HSL 裸分量, 见 ../references/tokens.md「v3 备注」)。完整 v3 config:
 *
 * import animate from 'tailwindcss-animate'
 * const config: Config = {
 *   darkMode: ['class'],
 *   content: ['./index.html', './src/**\/*.{ts,tsx}'],
 *   theme: {
 *     container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
 *     extend: {
 *       fontFamily: {
 *         sans: ['Inter Variable', 'Inter', 'ui-sans-serif', 'system-ui',
 *                '"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
 *         mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
 *       },
 *       colors: {
 *         border: 'hsl(var(--border))',
 *         input: 'hsl(var(--input))',
 *         ring: 'hsl(var(--ring))',
 *         background: 'hsl(var(--background))',
 *         foreground: 'hsl(var(--foreground))',
 *         primary:     { DEFAULT: 'hsl(var(--primary))',     foreground: 'hsl(var(--primary-foreground))' },
 *         secondary:   { DEFAULT: 'hsl(var(--secondary))',   foreground: 'hsl(var(--secondary-foreground))' },
 *         destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
 *         muted:       { DEFAULT: 'hsl(var(--muted))',       foreground: 'hsl(var(--muted-foreground))' },
 *         accent:      { DEFAULT: 'hsl(var(--accent))',      foreground: 'hsl(var(--accent-foreground))' },
 *         popover:     { DEFAULT: 'hsl(var(--popover))',     foreground: 'hsl(var(--popover-foreground))' },
 *         card:        { DEFAULT: 'hsl(var(--card))',        foreground: 'hsl(var(--card-foreground))' },
 *         brand: 'hsl(var(--brand) / <alpha-value>)',
 *         status: {
 *           success:     'hsl(var(--status-success) / <alpha-value>)',
 *           warning:     'hsl(var(--status-warning) / <alpha-value>)',
 *           destructive: 'hsl(var(--status-destructive) / <alpha-value>)',
 *           info:        'hsl(var(--status-info) / <alpha-value>)',
 *           muted:       'hsl(var(--status-muted) / <alpha-value>)',
 *         },
 *       },
 *       borderRadius: {
 *         lg: 'var(--radius)',
 *         md: 'calc(var(--radius) - 2px)',
 *         sm: 'calc(var(--radius) - 4px)',
 *       },
 *       boxShadow: {
 *         card: '0 1px 2px 0 rgb(15 23 42 / 0.03)',
 *         pop: '0 8px 24px -8px rgb(15 23 42 / 0.14), 0 2px 8px -4px rgb(15 23 42 / 0.06)',
 *       },
 *     },
 *   },
 *   plugins: [animate],
 * }
 * ════════════════════════════════════════════════════════════════════ */
