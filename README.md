# FlipClock

A React date/time picker rendered as a flip clock with smooth 3D CSS animations.
Aesthetic-first — built around the visual charm of the flip clock, not optimized for general-purpose usability.

## Features

- **Modes:** `date`, `time`, `datetime`, `countdown`
- **Themes:** `dark`, `light`
- **Sizes:** `xs`, `sm`, `md`, `lg`
- **Scroll modes:** `digit` (each card independent) or `unit` (whole field steps at once)
- **12 and 24-hour** time with AM/PM card
- **Controlled and uncontrolled** usage
- Zero runtime dependencies — React only
- Full TypeScript support

## Install

```bash
npm install @anahtiris/flipclock
```

## Usage

Import the component and its stylesheet:

```tsx
import { FlipClock } from '@anahtiris/flipclock'
import '@anahtiris/flipclock/dist/flipclock.css'
```

### Date picker

```tsx
<FlipClock
  mode="date"
  defaultValue={{ year: 2026, month: 5, day: 23 }}
  onChange={(v) => console.log(v)}
/>
```

### Time picker

```tsx
<FlipClock
  mode="time"
  defaultValue={{ hour: 9, minute: 30, period: 'AM' }}
  hour12
  onChange={(v) => console.log(v)}
/>
```

### Date + time

```tsx
<FlipClock
  mode="datetime"
  defaultValue={{ year: 2026, month: 5, day: 23, hour: 14, minute: 0 }}
  hour12={false}
  onChange={(v) => console.log(v)}
/>
```

### Countdown

Pass a live `CountdownValue` — the cards animate as the value changes:

```tsx
function Countdown({ targetDate }: { targetDate: Date }) {
  const [value, setValue] = useState(toCountdown(targetDate))

  useEffect(() => {
    const id = setInterval(() => setValue(toCountdown(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return <FlipClock mode="countdown" value={value} />
}

function toCountdown(target: Date) {
  const s = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000))
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'date' \| 'time' \| 'datetime' \| 'countdown'` | — | **Required.** Discriminates `value` / `defaultValue` / `onChange`. |
| `value` | per-`mode` (see [Types](#types)) | — | Controlled value. Type is narrowed by `mode`. |
| `defaultValue` | per-`mode` | — | Initial value for uncontrolled usage. Type is narrowed by `mode`. |
| `onChange` | per-`mode` | — | Called on every user scroll. Type is narrowed by `mode`. |
| `theme` | `'dark' \| 'light'` | `'dark'` | Visual theme. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Card size. |
| `scrollMode` | `'digit' \| 'unit'` | `'digit'` | Scroll behaviour. |
| `showSeconds` | `boolean` | `false` | Show seconds (time / datetime). |
| `showLabels` | `boolean` | `true` | Show field labels above cards. |
| `hour12` | `boolean` | `true` | 12-hour mode with AM/PM card (time / datetime). |
| `readOnly` | `boolean` | `false` | Block interaction without dimming. |
| `disabled` | `boolean` | `false` | Block interaction and dim. |

## Scroll modes

**`digit`** (default) — each card scrolls independently. Scrolling the tens card of DAY steps by 10; the units card steps by 1. Values are automatically clamped (e.g. day 29 becomes 28 when switching to February in a non-leap year).

**`unit`** — any card on a field scrolls the whole field by 1.

## Types

```ts
type DateValue      = { year: number; month: number; day: number }
type TimeValue      = { hour: number; minute: number; second?: number; period?: 'AM' | 'PM' }
type DateTimeValue  = DateValue & TimeValue
type CountdownValue = { days: number; hours: number; minutes: number; seconds: number }
type FlipClockValue = DateValue | TimeValue | DateTimeValue | CountdownValue

type FlipClockMode  = 'date' | 'time' | 'datetime' | 'countdown'
type FlipClockTheme = 'dark' | 'light'
type FlipClockSize  = 'xs' | 'sm' | 'md' | 'lg'
type ScrollMode     = 'digit' | 'unit'

// FlipClockProps is a discriminated union on `mode`:
type FlipClockProps =
  | { mode: 'date';      value?: DateValue;      defaultValue?: DateValue;      onChange?: (v: DateValue) => void;      /* ...shared */ }
  | { mode: 'time';      value?: TimeValue;      defaultValue?: TimeValue;      onChange?: (v: TimeValue) => void;      /* ...shared */ }
  | { mode: 'datetime';  value?: DateTimeValue;  defaultValue?: DateTimeValue;  onChange?: (v: DateTimeValue) => void;  /* ...shared */ }
  | { mode: 'countdown'; value?: CountdownValue; defaultValue?: CountdownValue; onChange?: (v: CountdownValue) => void; /* ...shared */ }
```

## License

MIT
