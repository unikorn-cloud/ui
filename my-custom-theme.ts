
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "var(--color-primary-900)",
		"--theme-font-color-dark": "var(--color-primary-50)",
		"--theme-rounded-base": "12px",
		"--theme-rounded-container": "16px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #308080 
		"--color-primary-50": "224 236 236", // #e0ecec
		"--color-primary-100": "214 230 230", // #d6e6e6
		"--color-primary-200": "203 223 223", // #cbdfdf
		"--color-primary-300": "172 204 204", // #accccc
		"--color-primary-400": "110 166 166", // #6ea6a6
		"--color-primary-500": "48 128 128", // #308080
		"--color-primary-600": "43 115 115", // #2b7373
		"--color-primary-700": "36 96 96", // #246060
		"--color-primary-800": "29 77 77", // #1d4d4d
		"--color-primary-900": "24 63 63", // #183f3f
		// secondary | #184040 
		"--color-secondary-50": "220 226 226", // #dce2e2
		"--color-secondary-100": "209 217 217", // #d1d9d9
		"--color-secondary-200": "197 207 207", // #c5cfcf
		"--color-secondary-300": "163 179 179", // #a3b3b3
		"--color-secondary-400": "93 121 121", // #5d7979
		"--color-secondary-500": "24 64 64", // #184040
		"--color-secondary-600": "22 58 58", // #163a3a
		"--color-secondary-700": "18 48 48", // #123030
		"--color-secondary-800": "14 38 38", // #0e2626
		"--color-secondary-900": "12 31 31", // #0c1f1f
		// tertiary | #246060 
		"--color-tertiary-50": "222 231 231", // #dee7e7
		"--color-tertiary-100": "211 223 223", // #d3dfdf
		"--color-tertiary-200": "200 215 215", // #c8d7d7
		"--color-tertiary-300": "167 191 191", // #a7bfbf
		"--color-tertiary-400": "102 144 144", // #669090
		"--color-tertiary-500": "36 96 96", // #246060
		"--color-tertiary-600": "32 86 86", // #205656
		"--color-tertiary-700": "27 72 72", // #1b4848
		"--color-tertiary-800": "22 58 58", // #163a3a
		"--color-tertiary-900": "18 47 47", // #122f2f
		// success | #10c010 
		"--color-success-50": "219 246 219", // #dbf6db
		"--color-success-100": "207 242 207", // #cff2cf
		"--color-success-200": "195 239 195", // #c3efc3
		"--color-success-300": "159 230 159", // #9fe69f
		"--color-success-400": "88 211 88", // #58d358
		"--color-success-500": "16 192 16", // #10c010
		"--color-success-600": "14 173 14", // #0ead0e
		"--color-success-700": "12 144 12", // #0c900c
		"--color-success-800": "10 115 10", // #0a730a
		"--color-success-900": "8 94 8", // #085e08
		// warning | #f0b010 
		"--color-warning-50": "253 243 219", // #fdf3db
		"--color-warning-100": "252 239 207", // #fcefcf
		"--color-warning-200": "251 235 195", // #fbebc3
		"--color-warning-300": "249 223 159", // #f9df9f
		"--color-warning-400": "245 200 88", // #f5c858
		"--color-warning-500": "240 176 16", // #f0b010
		"--color-warning-600": "216 158 14", // #d89e0e
		"--color-warning-700": "180 132 12", // #b4840c
		"--color-warning-800": "144 106 10", // #906a0a
		"--color-warning-900": "118 86 8", // #765608
		// error | #d02080 
		"--color-error-50": "248 222 236", // #f8deec
		"--color-error-100": "246 210 230", // #f6d2e6
		"--color-error-200": "243 199 223", // #f3c7df
		"--color-error-300": "236 166 204", // #eca6cc
		"--color-error-400": "222 99 166", // #de63a6
		"--color-error-500": "208 32 128", // #d02080
		"--color-error-600": "187 29 115", // #bb1d73
		"--color-error-700": "156 24 96", // #9c1860
		"--color-error-800": "125 19 77", // #7d134d
		"--color-error-900": "102 16 63", // #66103f
		// surface | #808090 
		"--color-surface-50": "236 236 238", // #ececee
		"--color-surface-100": "230 230 233", // #e6e6e9
		"--color-surface-200": "223 223 227", // #dfdfe3
		"--color-surface-300": "204 204 211", // #ccccd3
		"--color-surface-400": "166 166 177", // #a6a6b1
		"--color-surface-500": "128 128 144", // #808090
		"--color-surface-600": "115 115 130", // #737382
		"--color-surface-700": "96 96 108", // #60606c
		"--color-surface-800": "77 77 86", // #4d4d56
		"--color-surface-900": "63 63 71", // #3f3f47
		
	}
}
