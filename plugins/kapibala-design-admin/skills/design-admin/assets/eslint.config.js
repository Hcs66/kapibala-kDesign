/**
 * Kapibala_Design_Admin — ESLint flat config (React + TS + 设计规则集)
 *
 * 设计纪律靠 lint 在 CI 强制, 不只靠 review:
 *  - no-hardcoded-color  → 状态色必经 statusMap
 *  - i18next             → 文案必经 i18n
 *  - role 字面比较禁用    → 权限必经 PermissionGate
 *  - 品牌词禁用          → 产品名走 env / i18n (白标)
 *  - @backend 限制        → 后端类型只在 adapters 内 import type
 *  - no-console          → 日志必经 logger
 *
 * 依赖:
 *   npm i -D eslint @eslint/js typescript-eslint globals \
 *     eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-i18next
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import i18next from 'eslint-plugin-i18next'
import { defineConfig, globalIgnores } from 'eslint/config'

/** 绕过 statusMap 的字面 Tailwind 调色板色 (bg-red-500 / text-green-100 ...)。
 *  允许的色在 globals.css (background/muted/brand/status-*) 与 statusMap.ts 内。 */
const HARDCODED_COLOR_REGEX = String.raw`(?:bg|text|border|ring|fill|stroke|from|via|to|shadow|divide|outline|accent|caret|placeholder|decoration)-(?:red|green|amber|yellow|blue|indigo|violet|purple|pink|rose|sky|cyan|teal|emerald|lime|orange|fuchsia)-(?:50|100|200|300|400|500|600|700|800|900|950)`

/** 自家产品名 / 品牌词 —— 改成你的产品名, 禁止 hardcode (走 VITE_PRODUCT_NAME / i18n app.name)。 */
const PRODUCT_BRAND_REGEX = String.raw`(your-product-name)`

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage', 'playwright-report']),

  /* ───────────── 全量 TS / TSX ───────────── */
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    languageOptions: { globals: globals.browser },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-console': 'error', // 日志走 src/lib/logger.ts (内部 sink 用 inline disable 豁免)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=/${PRODUCT_BRAND_REGEX}/i]`,
          message: '禁止 hardcode 产品名/品牌词。走 import.meta.env.VITE_PRODUCT_NAME 或 i18n key app.name (白标约束)。',
        },
        {
          selector: `TemplateElement[value.raw=/${PRODUCT_BRAND_REGEX}/i]`,
          message: '禁止 hardcode 产品名/品牌词。走 VITE_PRODUCT_NAME / i18n app.name。',
        },
        {
          selector: `Literal[value=/${HARDCODED_COLOR_REGEX}/]`,
          message: '状态色必须走 src/lib/statusMap.ts。禁止字面 Tailwind 调色板色 (bg-red-500 / text-green-* 等)。',
        },
        {
          selector: `TemplateElement[value.raw=/${HARDCODED_COLOR_REGEX}/]`,
          message: '状态色必须走 src/lib/statusMap.ts。禁止字面 Tailwind 调色板色。',
        },
        {
          selector: "BinaryExpression[operator='==='][left.name='role'][right.value='admin']",
          message: '禁止 role === \'admin\' 字面比较。用 <PermissionGate> 或 useHasPermission()。',
        },
        {
          selector: "BinaryExpression[operator='==='][left.property.name='role'][right.value='admin']",
          message: '禁止 x.role === \'admin\' 字面比较。用 <PermissionGate>。',
        },
      ],
      // 后端类型只能在 src/adapters/** 内 import type (契约接缝)。组件/hook 直引 = 泄漏耦合。
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@backend', '@backend/*', '@backend/**'],
              message: '后端类型只能在 src/adapters/** 内 import type 引用。组件/hook 不得直接 import @backend。',
            },
          ],
        },
      ],
    },
  },

  /* ───────────── adapters: 唯一允许 import type @backend 的层 ───────────── */
  {
    files: ['src/adapters/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@backend', '@backend/*', '@backend/**'],
              allowTypeImports: true,
              message: '@backend 仅允许 import type (value import 会把后端运行时拖进前端 bundle)。',
            },
          ],
        },
      ],
    },
  },

  /* ───────────── i18n: 禁 JSX 硬编码文案 ───────────── */
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/components/ui/**', // shadcn 原语 (vendored)
      'src/i18n/**', // 翻译源
      'src/lib/statusMap.ts', // 指定 fallback 文案源
      'src/**/*.test.{ts,tsx}',
      'src/**/__tests__/**',
      'src/test/**',
    ],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'jsx-attributes': {
            exclude: [
              '^aria-.*$', '^data-.*$', 'className', 'style', 'href', 'src', 'alt',
              'role', 'id', 'name', 'type', 'placeholder', 'autoComplete',
              'checked', 'value', 'defaultValue', 'to', 'path',
              'titleKey', 'bodyKey', 'i18nKey',
              'size', 'variant', 'side', 'align', 'position', 'tone', 'state', 'level',
              'status', 'permission',
            ],
          },
          callees: {
            exclude: [
              'cn', 'twMerge', 'clsx', 'console\\..*', 't',
              'navigate', 'document\\..*', 'window\\..*', 'setProperty',
              'on[A-Z][a-zA-Z]*', 'set[A-Z][a-zA-Z]*', 'update',
            ],
          },
        },
      ],
    },
  },

  /* ───────────── shadcn 原语: 放宽 ───────────── */
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
])
