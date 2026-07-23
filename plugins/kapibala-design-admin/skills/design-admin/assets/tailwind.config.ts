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
 * 改成 `@tailwind base/components/utilities` + `:root { --brand: 243 75% 59%; ... }`
 * (HSL 裸分量, 全表见 ../references/tokens.md「v3 备注」)。完整 v3 config:
 *
 * import animate from 'tailwindcss-animate'
 * const config: Config = {
 *   darkMode: ['class'],
 *   content: ['./index.html', './src/**\/*.{ts,tsx}'],
 *   // 身份渐变类名是运行时哈希拼的 (identity-${n}), 源码无字面量, v3 会 purge。
 *   // 主修法是把 .identity-N 写成 @layer 之外的裸 CSS (见 globals.css);
 *   // safelist 只是双保险 (改 config 需重启 dev server 才生效, 不要依赖它)。
 *   safelist: [{ pattern: /^identity-[1-6]$/ }],
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
 *         // 表面抬升梯: canvas = 主内容区画布, sunken = 相对卡片内凹面 (输入框/表头)。
 *         // 带 <alpha-value> 占位, 支持 bg-canvas/50 之类透明度修饰符。
 *         canvas: 'hsl(var(--canvas) / <alpha-value>)',
 *         sunken: 'hsl(var(--sunken) / <alpha-value>)',
 *         brand: 'hsl(var(--brand) / <alpha-value>)',
 *         // brand-2 = 渐变终点, 由 brand 派生 (lib/whitelabel.ts deriveBrand2)。
 *         // 只用于装饰性渐变, 不承载语义。
 *         'brand-2': 'hsl(var(--brand-2) / <alpha-value>)',
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
 *         // ⚠ 必须是单个 var() —— 整条阴影 (含暗色内高光) 在 globals.css 的
 *         // --shadow-card / --shadow-pop 里, 亮暗各一套, 这两个 class 两主题共用。
 *         // 不要把颜色拆成 rgb(var(--rgb) / var(--alpha)) 拼在这里: Tailwind v3
 *         // 解析 boxShadow 颜色以生成 --tw-shadow-colored, 认不出嵌套 var(),
 *         // 会把颜色整个替换掉 —— 阴影变纯白/卡片色, 完全不可见且截图看不出
 *         // (实战踩坑, 见 ../references/rationale.md)。
 *         card: 'var(--shadow-card)',
 *         pop: 'var(--shadow-pop)',
 *       },
 *       transitionTimingFunction: {
 *         // 全站唯一缓动 (globals.css --ease-out), class 为 ease-out
 *         out: 'var(--ease-out)',
 *       },
 *       transitionDuration: {
 *         fast: 'var(--motion-fast)',   // 120ms
 *         base: 'var(--motion-base)',   // 180ms
 *         slow: 'var(--motion-slow)',   // 280ms
 *       },
 *     },
 *   },
 *   plugins: [animate],
 * }
 * ════════════════════════════════════════════════════════════════════ */
