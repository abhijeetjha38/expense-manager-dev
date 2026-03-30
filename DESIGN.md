

# DESIGN.md

## Visual System
- Font: System stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- Aesthetic: Clean & minimal — generous white space, subtle borders, muted backgrounds
- Dark/light mode via `darkMode: 'class'` on Tailwind config; toggle with `.dark` class on `<html>`
- Default to light mode; persist user preference in `localStorage`

## Color Tokens (Tailwind `theme.extend.colors`)
```js
primary:  { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' }
success:  { 50: '#f0fdf4', 500: '#22c55e', 700: '#15803d' }
warning:  { 50: '#fffbeb', 500: '#f59e0b', 700: '#b45309' }
danger:   { 50: '#fef2f2', 500: '#ef4444', 700: '#b91c1c' }
```
- Use `primary-600` as the default action color; `primary-700` for hover
- Use `success-500` for positive values (budget remaining, positive trends)
- Use `warning-50`/`warning-500`/`warning-700` for budget threshold alerts (50%, 80%)
- Use `danger-500`/`danger-700` for exceeded budgets, delete actions, errors
- Use Tailwind's default `gray` scale for text, borders, and backgrounds
- Do NOT create custom one-off colors outside this palette

## Typography Scale
| Role    | Classes                        |
|---------|--------------------------------|
| H1      | `text-3xl font-bold`           |
| H2      | `text-2xl font-semibold`       |
| H3      | `text-xl font-semibold`        |
| Body    | `text-base`                    |
| Small   | `text-sm text-gray-500`        |
| Caption | `text-xs text-gray-400`        |

## Spacing & Layout
- Use Tailwind's default spacing scale (0.25rem increments)
- Common patterns: `p-4` for card padding, `gap-3`–`gap-4` for grid/flex gaps, `mb-10` between page sections
- Page container: `max-w-4xl mx-auto p-8`
- Stat card grids: `grid grid-cols-3 gap-4`
- Form field spacing: `space-y-4`, label `mb-1` above input
- Do NOT use arbitrary spacing values (e.g. `p-[13px]`) unless absolutely necessary

## Components
- **Library:** shadcn/ui (Radix UI + Tailwind). Use shadcn components as the default.
- **Icons:** Lucide React — the default icon set with shadcn/ui. Do NOT mix icon libraries.

### Buttons
| Variant     | Classes                                                                        |
|-------------|--------------------------------------------------------------------------------|
| Primary     | `px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition` |
| Secondary   | `px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition` |
| Destructive | `px-4 py-2 bg-danger-500 text-white rounded-lg text-sm font-medium hover:bg-danger-700 transition` |
| Soft/Ghost  | `px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition` |
| Link        | `px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition underline`  |

### Form Inputs
- Use label above input: `block text-sm font-medium text-gray-700 mb-1`
- Input styling: `w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
- Apply the same focus ring to `<select>` and `<textarea>`

### Cards
- `p-4 bg-white border border-gray-200 rounded-xl shadow-sm`
- Use `rounded-xl` for cards; `rounded-lg` for buttons, inputs, and alerts
- Use only `shadow-sm` — do NOT use heavier shadows

### Alerts / Notifications
- Layout: `flex items-start gap-3 p-3 rounded-lg` with a Lucide icon + text block
- Info: `bg-primary-50 border border-blue-200` — text `text-primary-700`
- Warning: `bg-warning-50 border border-yellow-200` — text `text-warning-700`
- Danger: `bg-danger-50 border border-red-200` — text `text-danger-700`

## Do NOT Rules
- Do NOT use inline styles; use Tailwind utility classes exclusively
- Do NOT install or use any icon set other than Lucide React
- Do NOT create colors outside the defined `primary`, `success`, `warning`, `danger`, and `gray` palettes
- Do NOT use `shadow-md` or heavier; keep elevation subtle with `shadow-sm`
- Do NOT use arbitrary border radius; stick to `rounded-lg` (buttons/inputs/alerts) and `rounded-xl` (cards)
- Do NOT skip the `transition` class on interactive elements (buttons, links, toggles)