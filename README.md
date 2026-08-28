# Physiq

**Track · Train · Transform**

A training and nutrition tracker: one self-contained page, no build step, no
dependencies. Your log lives in `localStorage` on the device, with optional
end-to-end-private sync to your own Supabase project.

Open [`index.html`](index.html) in a browser, or serve the folder and add it to
your Home Screen — it installs as a standalone app and runs fully offline.

## What's in here

| Path | What it is |
|---|---|
| `index.html` | The whole app — markup, design system, and logic in one file. Typefaces and icons are embedded, so it renders correctly with no network at all. |
| `manifest.webmanifest` | Web app manifest: name, icons, standalone display, theme colour. |
| `sw.js` | Service worker. Navigations are network-first (so a deploy is picked up immediately); everything else is cache-first (so a cold start is instant). Supabase and Open Food Facts requests pass straight through. |
| `supabase-setup.sql` | One-time setup for the optional cloud sync — creates the table and locks it down with row-level security. |
| `brand/` | The progress-ring mark, wordmark, app icons, palette and usage rules. See [`brand/README.txt`](brand/README.txt) and open [`brand/physiq-brandsheet.html`](brand/physiq-brandsheet.html). |

## Targets that come from your own data

Physiq records what you ate and what you weighed, every day. That is the pair of
series needed to measure what you actually burn, so the **Adaptive** target mode
derives your targets from it rather than from a coefficient:

```
expenditure = mean intake − (weight change × 3500) / days
```

The weight term is the least-squares slope of the *smoothed* series, over a
28-day window, ignoring the day still in progress. Before there is enough
history it falls back to Mifflin-St Jeor from your profile, then to bodyweight
alone — and it says which one it is using. The target is expenditure plus
whatever surplus or deficit the current phase asks for, floored so an aggressive
cut is a choice rather than a default.

The Progress tab shows the estimate against your intake, so the number is
inspectable rather than magic.

## Training analysis

- **Per-exercise history** — tap any exercise name for every session you have
  logged and the trend in estimated 1RM.
- **Weekly volume by muscle** — completed sets grouped by muscle against common
  hypertrophy ranges. Mid-week it tells you what is left, not that you are
  behind.

## Repeating meals

Eating the same thing two or three times a day is normal, and re-logging it
means re-entering the amount. Anything already logged can be copied instead,
carrying its macros and serving note over exactly:

- **A whole meal** — the copy button in any meal header. Pick any number of
  destinations at once, including the same meal again if you ate it twice.
- **A single item** — the copy button on its row, or from the entry itself.
- **Into an empty meal** — an empty meal offers to copy an earlier one in.

Every copy comes with an Undo. Foods you have not saved yet can be searched by
name against Open Food Facts, but your own saved list always comes first — the
long tail is for the exception, not the daily loop.

## Design system

Everything in the UI is drawn from one token set at the top of the `<style>`
block — a surface ramp, an ink ramp, one accent, a validated data palette, and
scales for type, space, radius, elevation and motion. Two rules keep it honest:

- **Accent budget.** Teal appears on exactly three things per screen: the single
  primary action, the one live or leading datum, and the active navigation item.
  Focus and press feedback are exempt. Anything merely *selected* uses the
  neutral selection tokens.
- **Control boundary.** Only things you can touch get a bright edge. Fields,
  checkboxes and progress tracks use `--line-field` / `--track-edge`, which
  measure above 3:1 against every surface in the ramp; structure keeps the
  hairline `--line`.

The macro trio (protein / carbs / fat) is a categorical palette validated for
colour-vision deficiency at all pair distances on the app's dark surface, and
deliberately contains no green so it can never collide with the brand accent or
the success state.

## Layout

One codebase, three shapes: a phone-width column, a two-column tablet frame, and
a desktop dashboard with a left sidebar (collapsing to an icon rail below
1180px). The whole type and spacing scale steps up on the desktop canvas through
a single token override. You can pin a layout from Settings if you'd rather not
use the automatic one.

## Accessibility

Full keyboard operation (Tab, Enter, Escape, arrow keys to walk the day, digits
to type your PIN), a visible focus ring on every control, `role`/`aria` state on
every custom control, dialog semantics with focus trapping and `inert`
backgrounds, live regions for the toast and rest timer, honoured
`prefers-reduced-motion` and `forced-colors`, and safe-area insets on all four
edges.
