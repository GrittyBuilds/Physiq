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

## Your program, not a preset

Every phase ships with a split, and every part of it is yours to change. The
Program tab opens an editor: rename days, reorder them, add and delete them,
add and remove exercises, move a movement between blocks, and set the working
sets, rep range, target RIR, intensity technique and priority flag on each one.

Nothing is stored until you change something. Until then you are running the
built-in split and still inheriting improvements to it; the first edit takes a
copy, and the preset is never touched. Each phase keeps its own program, so
switching from a Lean Bulk to a Cut still switches the split as well as the
macros.

**Multi-week blocks** are not a separate concept. A four-week block of a
five-day split is a twenty-day cycle, so Duplicate copies the cycle and you
edit what differs in week two. The rotation runs through the whole thing.

The name field is backed by a library of 186 movements, built from the presets,
the swap alternatives, and everything you have ever logged — and it accepts
anything you type. Within a day a name identifies one movement, so entering a
name that is already there gets a `(2)` rather than quietly merging two
exercises' histories.

## What a past date shows

Page back to last Tuesday and you see Tuesday: the movements you actually
performed, in the order you did them, with the day's name as it was at the
time. Not today's prescription with Tuesday's numbers poured into it, and not
a screen that silently hides anything you did which today's program happens
not to contain.

A date carries its own record of the session — which program, which day, the
ordered list of movements — written only while the app is genuinely rendering
a plan for that exact date. That guard is the whole design: typing on an old
log can never brand it with today's program.

Four things a date can be, and it tells you which:

- **Today, or a date you chose to log against** — the full plan, day chips,
  weight suggestions and rest timer.
- **A recorded session** — what you did, with the prescription resolved from
  the program where it still matches, and honest silence where it does not.
- **A session logged before any of this existed** — derived from the sets
  themselves, still fully editable.
- **A day with nothing on it** — which offers to log a workout against it.

Every one of them is writable, and any of them can gain an exercise the
program does not contain.

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

The estimate states its uncertainty. `2,480 ± 140 · measured from 22 of the
last 28 days` — the band combines the standard error of your weight trend
(taken on the raw weigh-ins, so smoothing cannot flatter it) with the standard
error of mean intake. Days that fall far below your own median intake are
under-logged rather than eaten, so they are excluded and counted, not quietly
averaged in.

## What a set was

The set number is a button. Tap it to mark the set a warm-up, or a drop, myo or
rest-pause set. A working set is the default and stores nothing.

Warm-ups are the distinction that matters: they are excluded from weekly volume,
personal records, estimated 1RM and session tonnage, and they no longer trick
the weight suggestion into thinking you hit the top of your rep range. Drop,
myo and rest-pause sets count as the working sets they are.

RIR is loggable per set from Settings, and the prescribed set count is a floor —
add sets on the day, and remove any you added that are still empty.

## Training analysis

- **Per-exercise history** — tap any exercise name for every session you have
  logged and the trend in estimated 1RM.
- **Weekly volume by muscle** — completed sets grouped by muscle against common
  hypertrophy ranges. Mid-week it tells you what is left, not that you are
  behind. A movement the classifier cannot place can be tagged once and is then
  classified correctly on every date it was ever logged.
- **Session summaries** — the clock starts on the first set you touch. Finishing
  gives you time, working sets, tonnage, muscles trained, personal records, and
  a line per exercise against the last time you trained it. Today keeps the
  receipt.

## Measuring, not just weighing

Waist, chest, arm, thigh, hips, shoulders, calf and neck, logged against the day
with a trend and a delta. Three fields by default, because eight is a form
nobody fills in.

Physiq holds your bodyweight, your waist and your lifts in one place, which lets
it answer the question a nutrition app and a training app each only half have:

```
+0.45 lb/wk   +0.01 in/wk
Weight is going on and your waist is not. That is the version of a bulk you want.
```

It distinguishes a lean gain from a waist climbing as fast as the scale, weight
coming off from weight coming off *the waist*, and a flat scale with a
shrinking waist — a recomposition, which is invisible to anyone not measuring.
It refuses to speak until it has eight weigh-ins and three measurements spanning
three weeks, and says what it still needs.

## Logging in one tap

Above the food log is a row of the things you usually eat in this meal, each
logging in one tap at the exact portion you last used. It is built from the log
rather than a curated list, so a quick-add counts, and scored by how often
something lands in that meal, decayed on a three-week half-life. A single entry
is not yet a habit; anything you have not eaten in a month is no longer a usual,
however often it used to be.

Meals themselves are yours: rename them, reorder them, change the hour each one
starts, add and delete them. Deleting one moves what was logged into it rather
than orphaning it.

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

When a lookup does not produce a food, the app says which of the several
possible reasons it was: no matches, results with no nutrition data, offline,
no answer, an error from the database, a response it could not read, or a
request that never left the device. The last of those names the likely cause,
because the browser will not — a blocked host, a DNS failure and a CORS
rejection all arrive as one indistinguishable error.

## Your data

Everything is on the device. A schema version and a migration chain carry old
blobs forward, and the blob is snapshotted before any migration runs — Settings
can roll back to it in one tap.

Settings also shows where the space has gone, because the browser caps
`localStorage` at around 5 MB and progress photos are usually most of it. Past
82% the app warns; if a write actually fails, a header alert says so on whatever
tab you are on and points at the export, rather than dropping writes silently.

Cloud sync is optional and merges per day and per section. Settings travel under
their own clock and the program under another, so editing a program on one
device and logging a weigh-in on another does not make either disappear. A build
older than the blob contributes its days without its settings deleting keys it
has never heard of, and a build newer than this one is refused outright rather
than merged down.

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
