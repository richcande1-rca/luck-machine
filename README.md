# LUCK MACHINE — Model 5D-20

A retro-industrial browser dice game styled as a fictional Soviet-era long-range command console. **Version 1.11.9 — Animation/Outcome Isolation.**

## Play

[Open LUCK MACHINE](https://richcande1-rca.github.io/luck-machine/) (requires GitHub Pages to be enabled in repository settings).

Or download `index.html`, `audio.js`, `hardware.css`, `field.css`, `telemetry.css`, `telemetry.js`, `legibility.css`, `scoring.js`, `scoring.css`, `operator.css`, `world-board.js`, `world-board.css`, and `mobile.css` together in the same folder and open `index.html` in a modern browser. No installation or build process is needed.

## Rules

- Five illuminated dice with individual HOLD controls and a **KEEP IT!** button to hold all matching dice at once.
- Three rolls per turn, **12 turns per game**.
- Score poker-style dice combinations. Repeatedly banking any category earns escalating payouts: first 1×, second 3×, third 5×, fourth 7×, etc. A large straight pays **1,500 points** before repeat multipliers.
- Bank all eight distinct scoring categories during one session for an **immediate one-time 25,000-point collection bonus**. Successful called hands count; failed calls do not. The paytable marks collected hands.
- Bank your hand for points, or **CALL YOUR HAND** before your final roll to attempt a better combination for double the payout (including any repeat bonus); a failed call scores zero and does not increase repetition.
- The **twelve-turn WORLD TOP 10** is the only scoreboard offered in the game. The new `face-v3-12` ruleset separates repeat-hand scores from earlier formats. Existing Cloudflare D1 scores are retained as archives, but are not shown in-game. The Cloudflare Worker must support `face-v3-12` for worldwide scores. Deploy the latest `worker/src/index.js` to allow the increased score ceiling; no database reset is needed.

Keyboard: **Space / Enter** = roll, **1–5** = toggle corresponding die, **K** = auto-hold matches, **B** = bank/end turn/resolve, **C** = call.

## Animation/Outcome Isolation (v1.11.9)

- Each launch determines the settled five-die outcome before the animation, preserving held values and the existing secure RNG. The nixie-style pip previews now use a separate display-only array, never temporarily overwriting the scoring/hand-recognition dice.
- Dice stop in their original staggered order; phone and desktop effects/timing are unchanged. After every die settles, the authoritative dice are committed once, and the display overlay is removed.
- Starting a new session while the previous roll is still cycling cancels that animation and prevents a stale timer from changing the new game's dice.
- **No gameplay changes:** twelve turns, three launches, HOLD / KEEP IT!, CALL IT! double-or-nothing, hand scoring, 25,000 collection reward, sound effects and existing worldwide Top 10 remain unchanged. No Cloudflare Worker deployment is needed.

## Competitive Repeat-Hand Bonuses (v1.11.8)

- Stronger escalating payouts for **each successful repeat of the same scoring category**: first ×1, second ×3, third ×5, fourth ×7, fifth ×9, continuing in steps of +2×. This applies to all categories, including full houses and straights. Face-based additions are included before the multiplier.
- Five full houses now earn **26,000–29,250** points without CALL IT!, versus the unchanged **25,000-point** prize for collecting all eight different scoring hands. Five four-of-a-kinds now earn **51,250–57,500** points. Successful CALL IT! still doubles the hand payout; a failed call scores zero and does not advance the repeat count.
- **No leaderboard reset:** retain the same active `face-v3-12` WORLD TOP 10 and all existing D1 entries; new scores naturally replace older lower-scoring entries. Earlier rulesets remain archived and inaccessible from the game.
- The theoretical maximum with twelve successful called five-of-a-kinds of sixes is **1,612,800** (5,600 × 2 × [1 + 3 + ... + 23]). Browser score validation and Worker source accept the higher ceiling. **Deploy the latest `worker/src/index.js` in Cloudflare** for scores above the previous 873,600 ceiling; without deployment, the old Worker may still reject extreme scores.
- Twelve turns, three rolls each, ordinary hand payouts, dice RNG, the one-time collection award, CALL IT! rules, sound, and UI layout are unchanged.

## Stronger Repeat-Hand Bonuses (v1.11.7)

- The payout multiplier increases by **1× for every additional bank of the same hand**: first ×1, second ×2, third ×3, fourth ×4, and so on. The existing face-aware payouts and CALL IT! doubling still apply; failed calls do not count as repeats.
- The **25,000-point bonus for all eight different hands remains unchanged**. Players can choose between collecting eight hands and chasing high-value repeats.
- The live **`face-v3-12` WORLD TOP 10 stays in place**, with all existing entries untouched; new scores compete on the same board and naturally displace older scores when higher.
- The theoretical ceiling for 12 called five-of-a-kinds rises to **873,600** (5,600 × 2 × [1 + 2 + ... + 12]). The browser validation and Cloudflare Worker source now accept that ceiling. **Deploy the updated `worker/src/index.js` in Cloudflare** to accept scores above the previous 504,000 limit; otherwise, the existing online board still handles lower scores.
- No changes to dice outcomes, 12 turns, game controls, audio, interface layout, stored D1 entries, or ruleset identifier.

## Mobile Sound and Collected-Hands Display (v1.11.6)

- **Phone sound performance:** The phone's Web Audio mixer now connects directly through gain stages instead of the desktop EQ, compressor and oversampled waveshaper/limiter. The phone uses two brief electronic launch tones and a single tone per die stopped; recurring roll tick sounds and static bursts are skipped entirely. **Desktop audio is unchanged.**
- **Stationary electronic dice:** Subtly deeper glass/metal faceplates, brighter high-contrast pip cores, and dim inactive pip positions improve readability on phone screens. Held dice retain the amber indication. Pip shadows stay disabled on phones, and the dice neither spin nor use animated glow effects.
- **Hands won:** Eight compact indicators show each distinct scoring category. A banked hand lights up and shows a checkmark; bank it again and the indicator shows a repeat count (×2, ×3, etc.). Unbanked categories remain dim. Only **successfully banked** hands count, and NEW SESSION clears the display. On desktop this extra panel is hidden.
- The existing compact phone layout, 12 turns, 3 rolls per turn, payouts, secure dice outcomes, +25,000 eight-category bonus, called-hand rules and `face-v3-12` worldwide competition remain untouched. No Cloudflare Worker changes.
- Code-level checks include desktop/phone Web Audio node comparisons, banked-hand/repeat/reset display states, JavaScript syntax and CSS structure. Physical-device performance is not asserted until tested.

## Stationary Electronic Dice Test (v1.11.5)

- Restores the original *electronic pip-cycling* look on phones; dice faces stay stationary, and the pips switch patterns about every 120ms until each die settles.
- Removes the rotating CSS die transform introduced in v1.11.4. On phones only, temporarily removes **individual pip glow shadows** as a targeted paint-performance test, while retaining the bright pip colors, illuminated faceplates, and original styling on desktop.
- Keeps the phone's 650ms spin lead-in, 90ms staggered stopping, the existing secure final dice results, and unchanged desktop 70ms preview cadence.
- All other phone layout features, menus, scorekeeping, repeat-hand bonuses, collection, turns, and worldwide leaderboard remain unchanged.
- The change is intended for real-phone comparison with v1.11.4; simulated timing/results passed, but hardware rendering improvement is not assumed.

## Low-Workload Phone Dice Animation (v1.11.4)

- Removes the 1.11.3 phone-side `requestAnimationFrame` loop, 18fps pip preview mutations, and repeated 45ms pip fades, which worsened the reported stutter.
- A rolling die now gets **one CSS transform animation** while its currently visible face stays fixed. The face changes **only once when that die settles**, using the secure target already generated at roll start. There are no ongoing JavaScript preview-frame updates on phones.
- Each unheld die has one settlement timer and the roll has one completion timer; the 650ms spin lead-in, 90ms stagger, and approximate 1.1-second total five-dice duration are preserved. Rolling and finish notifications still fire once.
- Reduced-motion users see no spinning. The original desktop 70ms animation and all phone sizing/menu improvements remain unchanged.
- No changes to scored dice RNG, holds, 12 turns, repeat-hand scoring, collection bonus, sound engine, Cloudflare ruleset `face-v3-12`, or the worldwide leaderboard.
- JavaScript syntax, CSS structure, and simulated normal/delayed timer ordering verified. These are code-level checks; physical-phone smoothness has not been benchmarked.

## Frame-Synchronized Phone Rolls (v1.11.3 — superseded)

- The compact phone layout and existing 1.1-second roll duration remain unchanged.
- During phone rolls, visual dice previews now run through `requestAnimationFrame` instead of a fixed 120ms interval. Changes are capped to approximately one preview every 55ms, making the sequence smoother without rebuilding the dice DOM on each display frame.
- A subtle 45ms opacity transition softens pip changes on phones, except when reduced-motion preferences are enabled. Desktop dice animation, scoring and visual styling are unchanged.
- Final targets are still generated before the animation using the same secure random source. Holds, CALL IT!, repeat-hand bonuses, the eight-hand collection, 12 turns and the `face-v3-12` world board are unchanged.
- Verification covers 30, 60 and 120Hz simulated frame callbacks, held dice, timing, exact settled outcomes and missed frames. These are code-level tests, not physical-phone performance measurements.

## Compact One-Screen Phone Game (v1.11.2)

- At phone widths (up to 700px), the main playing screen prioritizes **score/turn/rolls/world best, all five dice, 8-hand collection progress, LAUNCH, KEEP IT!, BANK/RESOLVE and CALL IT!**. Decorative radio, inventory and extra instrument panels no longer consume vertical screen space on phones; desktop appearance remains unchanged.
- **PAYOUTS** in the phone footer opens the complete score/collection table. **MORE** offers MANUAL, SOUND ON/OFF and AUDIO TEST. NEW SESSION and TOP 10 remain on the main phone screen. All original desktop footer controls are unchanged.
- Short portrait phone viewports get a measured, modest fit adjustment when necessary, without requiring the entire desktop console to be scaled down. On extremely small viewports the game can still scroll rather than shrinking controls below usability.
- Phone roll animation now settles in approximately **0.9–1.1 seconds** depending on held dice, versus the unchanged desktop animation of approximately 1.3–1.9 seconds. Only visual timing is changed: the secure final dice draw, hold logic and scoring remain identical.
- Hidden phone radio instrumentation no longer triggers constant paint changes.
- Gameplay and worldwide rankings are unaffected: 12 turns, repeat-hand bonuses, 8-hand collection and Cloudflare `face-v3-12` remain the same. **No Cloudflare or D1 update is needed.**

## Phone Layout and Performance (v1.11.1)

- A **phone-only** last-in-cascade `mobile.css` resolves conflicting older responsive rules at widths up to 700px. At 320–430px it shows a readable 2×2 score panel, five square dice, a full-width LAUNCH actuator and three usable secondary controls, with no scaled-down desktop cabinet.
- Compact radio tuning hardware remains accessible on phones; the decorative animated uplink illustration is hidden there. Other cabinet elements keep their olive industrial appearance.
- The dice renderer caches the five sets of nine pip elements and each HOLD badge once, updates only changed faces/held states and defers accessibility-label updates until rolls settle. Roll duration and final RNG outcomes are unchanged. Mobile dice previews refresh every 110ms instead of 70ms; desktop still refreshes every 70ms. Animated preview faces use lightweight random numbers, but the final dice targets still use the unchanged secure RNG.
- On phones the radio paints about every 650ms while idle and every 160ms when rolling/active, and still responds instantly to user actions. Desktop timing is unchanged. Hidden tabs throttle to ~1 second.
- Phone CSS drops continuous dice-face vibration, reduces glow/shadow cost and removes modal backdrop blur. Touch targets and the score modal fit narrow screens; desktops remain on their previous layout.
- **No game-rule changes:** 12 turns, repeats, eight-hand collection, CALL IT!, audio engine, dice probabilities and the `face-v3-12` worldwide leaderboard are untouched. No Cloudflare Worker or D1 changes.

## Repeat-Hand Bonuses (v1.11.0)

- Every successful bank of a scoring category (including pairs and straights) increases that category's bank count. Each category has an independent multiplier: first ×1, second ×1.5, third ×2, fourth ×2.5, increasing by ×0.5 each subsequent bank.
- The multiplier applies to the category's normal face-aware payout, and **CALL IT!** still doubles successful called payouts. Failed calls neither score nor advance bank counts. The 25,000-point complete-collection prize is never multiplied.
- The paytable shows a repeat count after the second successful bank and the payout preview displays the repeat multiplier. No extra controls, turns, or visual panels were added.
- New worldwide ruleset: `face-v3-12`, with a maximum theoretically possible score of **504,000** (twelve successfully called five-of-a-kinds with the increasing repeat multiplier). `face-v2-12` is retained read-only in D1. The frontend does not mix the two competitions. **Deploy the updated Cloudflare Worker** from `worker/src/index.js` to restore worldwide scores after the game update; no D1 migration or deletion is necessary.

## World-Only Leaderboard (v1.10.1 — historical release)

- The TOP 10 dialog offers **REFRESH** and **CLOSE** only. In v1.10.1 it displayed `face-v2-12` online rankings; v1.11.0 switches to `face-v3-12`.
- The end-of-game dialog keeps the final score, the worldwide Top 10 qualification and **POST WORLD SCORE** flow, plus REFRESH, NEW SESSION and CLOSE. There is no SAVE LOCALLY fallback.
- If the network or Cloudflare Worker is unavailable, show **WORLD LEADERBOARD OFFLINE** (or **WORKER UPDATE REQUIRED**, when applicable), without displaying cached local rankings or accepting local-only scores. The score remains visible at game over, but it is **not posted** until the worldwide submission succeeds.
- The WORLD BEST readout displays the online best only (or a dash if unavailable).
- Previously written local browser records are neither loaded nor deleted. Existing `face-v1-10` and `face-v1` world data remain untouched in Cloudflare D1 and the Worker; the game no longer offers archive navigation. No database or Worker deployment is required for this interface-only change.
- All game mechanics, collection bonus, scoring, audio, input controls and LAUNCH panel layout remain unchanged.

## Twelve Turns and Complete Collection (v1.10.0 — historical release)

- Sessions run for **12 turns** (still three launches per turn).
- **Large straight** pays 1,500 instead of 800. Small straight remains at 600; other payouts and face bonuses are unchanged.
- Every **successfully banked distinct category** adds one mark to the eight-hand collection. A successful CALL IT! counts as the declared hand, regardless of other hands present. A failed CALL IT! earns zero and records no category. Repeating a hand still pays points but does not advance the collection.
- Collect all eight (pair, two pair, three, small straight, large straight, full house, four, five) during one game to add **25,000 points once, immediately**. CALL IT! never doubles the collection bonus. The existing paytable displays completion marks, the collection tally and its prize; the manual and final result screen explain it.
- Separate ruleset: `face-v2-12`, with a theoretical score ceiling of **159,400** (12 × double 5,600 + 25,000). The release initially added local `luck-machine-leaderboard-v4-twelve-turn` scores alongside the earlier `luck-machine-leaderboard-v3-ten-turn` and twenty-turn archives. Version 1.10.1 subsequently removed these options from the game UI while retaining existing records.
- The new front-end World Top 10 requires the **existing** Cloudflare Worker to be updated from `worker/src/index.js` via the Cloudflare dashboard. Its existing D1 binding and table remain the same. Until that update, games remain playable but the world board correctly reports that a Worker update is required.
- No changes to dice probabilities, hold/keep controls, radio hardware, audio engine, Miami Nights, or the retired leaderboards. The 1.9.2 LAUNCH layout is retained.

## Version 0.9

The five illuminated dice faces have a square 1:1 aspect ratio on desktop and mobile. Every roll, including the first roll of each turn, now uses the same longer stepped electronic cycling (about 1.3–1.9 seconds, depending on how many dice are rolling). Gameplay probabilities and scoring remain unchanged.

## Corrected Two-Row LAUNCH Panel (v1.9.2 — historical release)

The first button is now a genuinely prominent, **full-width LAUNCH / RELAUNCH
actuator on its own 78-pixel-tall top row**, with the three smaller controls
(**KEEP IT!**, **BANK / END TURN / RESOLVE**, and **CALL IT!**) aligned beneath
it. The decision label, the hand name, the challenge status and concise
operator instructions occupy a compact information grid *above* the buttons.

This removes the v1.9.1 negative-margin enlargement, which enlarged the
label without guaranteeing space and caused text to overflow. The LAUNCH
label cannot spill into neighboring buttons. The cabinet retains its
existing desktop auto-fit (complete console on one screen); phones retain
natural vertical scrolling and a larger touch target.

No changes to the 10-turn game length, scoring, dice probabilities, HOLD,
KEEP IT!, challenge resolution, audio, world archive, or Cloudflare Worker.

## Oversized LAUNCH Actuator (v1.9.1)

The main game control is now **LAUNCH** for the first dice throw, and
**RELAUNCH** when unheld dice are rerolled. The new primary actuator uses a
larger industrial red metal housing, stronger lighting, and a prominent
depressed/pressed state. It **extends upward into the free decision-panel
space** instead of increasing the size of the whole cabinet or the row of
secondary controls. Its height is recalculated as message text or viewport
dimensions change, keeping clearance above the button and preserving the
single-screen desktop layout. Phones use a naturally taller key in the
existing mobile scrolling layout.

The on-console keyboard hint, first-launch instructions, progress meter and
operator manual use the LAUNCH / RELAUNCH terminology. Space / Enter remain
the controls. Roll physics, timing, HOLD / KEEP IT!, scoring, sound, the
Cloudflare Worker and both archives are **unchanged**.

## Ten Turns, KEEP IT! and New Scoreboard (v1.9.0)

Game sessions are now **ten turns**, with up to three rolls per turn. The
**KEEP IT!** button (shortcut **K**) automatically holds all dice belonging
to matching groups, such as three sixes or two pairs, without consuming a
roll or adding any points. Manual HOLD controls remain available to fine-tune
the result. If all five dice are held, REROLL is disabled so an empty roll
cannot accidentally consume an attempt. The existing BANK / RESOLVE logic
remains unchanged, including its challenge restrictions.

The new 10-turn worldwide Top 10 uses a separate Cloudflare ruleset
(`face-v1-10`) and maximum score of **112,000**. The earlier twenty-turn
world archive (`face-v1`) remains **read-only**, and 20-turn local records
stay in the old browser key `luck-machine-leaderboard-v2`. New local
records go in `luck-machine-leaderboard-v3-ten-turn`. Even older pre-1.6
fixed-scoring records (`luck-machine-leaderboard-v1`) remain available.
No previous scores are deleted or compared against the new competition.

**Cloudflare dashboard step required:** Copy the new code from
[worker/src/index.js](worker/src/index.js) into the existing
`luck-machine-board` Worker using **Edit Code → Deploy**. Keep the
existing **DB → luck_machine_board** binding and existing D1 table.
**Do not recreate the database or run any SQL.** Detailed manual
instructions are in [worker/README.md](worker/README.md). Until that
dashboard update happens, the ten-turn world scoreboard reports that the
Worker update is required; local ten-turn scoring works immediately.

The industrial 5D-20 cabinet model designation is retained. The main
cabinet remains a one-screen desktop layout, with four control buttons
across and a two-row layout allowed on small mobile screens. Sound levels,
dice physics, category scoring, and Miami Nights are untouched.

## Launch Control and Challenge Resolution (v1.8.4)

The **ROLL / REROLL** button is now the visually dominant field-console
actuator: wider in its existing three-button row, bright industrial red-orange
finish, a pilot light that shines only when ready, and tactile pressed styling.
The control row has no added height, preserving desktop single-screen fit and
existing mobile flow.

In a **CALL IT!** challenge, the existing BANK button becomes **RESOLVE** and
stays **disabled/dimmed** while the target has not been achieved and rolls
remain. RESOLVE becomes available either when the called combination is
achieved (allowing early payout) or when the **third roll has finished**
(allowing a failed call to close the turn with zero). Clicking RESOLVE and
the **B** keyboard shortcut enforce precisely the same rule. The challenge
instructions accurately describe early success and failed final rolls.
No scoring formula, dice motion, audio, or online archive behavior was changed.

## Master Volume Fine-Tuning (v1.8.3)

Adjusted the final audio master gain from 0.88 to 0.80 (approximately 9% quieter). All sound effects, equalization, compression, limiting, Audio Test behavior, and gameplay are unchanged.

## Audio Overhaul and Diagnostics (v1.8.2)

The existing synthesized Web Audio effects now pass through a louder preamp (~+14 dB),
a low-frequency trim / midrange-presence stage designed for Chromebook and small laptop
speakers, a dynamics compressor, and final soft limiting. The mechanical relay and
rolling ticks gain audible high-frequency detail. The game keeps its original synth
phrases and sound-on/off toggle.

A new compact **AUDIO TEST** button sits beside SOUND: ON. Clicking it plays a
short mechanical click followed by three unmistakable rising tones, while a modal
reports whether Web Audio is supported, enabled, and actively running (or suspended).
The test can be replayed without restarting the game. A RUNNING status confirms
that the browser has accepted scheduled audio, but cannot verify that a muted tab,
operating-system output device, or speakers are actually producing sound. Check
Chrome site mute and Chromebook output volume if the test is still silent.

No game mechanics, dice motion, scoring, world leaderboard, or cabinet height were
changed. The Web Audio script uses its own versioned URL for cache refresh.

## Automatic Game-Over World Top 10 (v1.8.1)

After the 20th BANK, the game-over sound plays and the **World Top 10** dialog opens automatically. The operator's final score appears above the live worldwide rankings, regardless of whether the final score qualifies. When qualified, an initials input and **POST WORLD SCORE** button appear **in the same dialog**; there is no separate name-entry screen. On a successful post, the rankings update in place and the dialog confirms the transmission. The player can also choose to save locally without posting.

If the world API is unavailable, the very same dialog identifies that condition explicitly, shows the locally stored Top 10, and offers local saving when the score qualifies. Old fixed-payout legacy records remain accessible through the usual TOP 10 screens. The game-over dialog is compact to avoid scrolling at ordinary desktop heights. Dice behavior, sound, category scoring, the twenty-turn limit, and the main cabinet layout are unchanged.

## World Top 10 (v1.8.0)

*Historical release note: v1.8.0 used the twenty-turn `face-v1` ruleset. As of v1.9.0 it is a read-only archive; the live competition is `face-v1-10`.*

The TOP 10 console button now opens a **worldwide scoreboard interface**, with explicit
live/offline status, refresh, local Top 10, and pre-v1.6 legacy Top 10. At game-over,
a qualifying online score can be submitted with 1–5-character initials. Failed
network submissions never silently count as posted: they offer retry/local saving.
The score window never freezes or stops the dice if the network is unavailable.

**BACKEND SETUP:** The separate Cloudflare Worker and D1 database were created
manually through the dashboard. The owner confirmed the API returned an empty,
valid world Top 10 on October 24, 2026. See worker/README.md for setup and
configuration. The configured endpoint is:

    https://luck-machine-board.rich-gothic.workers.dev/api/board

The frontend displays **WORLD BOARD OFFLINE** whenever the live API cannot be reached. Do not interpret an offline/empty table as a live scoreboard.

Old 1.6+ locally saved scores remain in luck-machine-leaderboard-v2, and older
fixed-payout records remain in luck-machine-leaderboard-v1. They are not wiped,
migrated into the worldwide Top 10, or shared without an explicit final submission.

The backend checks formatting, Top 10 cutoff, and maximum theoretical score
(20 turns × 2 × 5,600 = 224,000). Because this is anonymous client-side dice,
these basic checks do NOT make the worldwide board tamper-proof.

The roll timing, face-value payout rules, CALL IT!, SOUND engine, active
radio hardware, and olive-drab cabinet were not changed.

## Audio Level Adjustment (v1.7.2)

Increased the overall sound engine master gain from **0.64 to 0.78** (about 22% higher signal amplitude), leaving the relative sound-effect mix, sound toggle, and gameplay unchanged. The browser loads the versioned audio script to avoid stale caching. The panel now shows **BUILD 1.7.2**.

## Screen-Fit Correction (v1.7.1)

Restores the original **all-on-one-screen desktop requirement**. The forced minimum scaling introduced in 1.7.0 caused scrolling at normal Chromebook display heights; it has been removed. The full panel now fits the viewport, with tighter outer body padding and the same improved legibility styles. Scoring, dice, audio, radio and records are unchanged.

## Operator Visibility (v1.7.0)

A deliberate legibility pass: bigger, higher-contrast **paytable categories**, payout numerals, radio labels, meter/channel descriptions, status-panel headers, dice HOLD indicators, decision instructions, challenge status, keyboard shortcut hints, and menu buttons. Long category names use the same period-looking condensed stencil family rather than relying on tiny monospace type.

The chassis is still the same olive-drab steel with its existing instrumentation and five square illuminated dice. Spacing and borders are slightly compressed to recover screen height for lettering rather than enlarging the case. Build 1.7.1 removes the 90% minimum scale that caused unwanted scrolling. On desktop, the entire cabinet once again scales to the available window height, with reclaimed page margins to preserve as much readable text size as possible. Mobile and tablet screens continue natural scrolling. The bottom build plate now clearly reads **BUILD 1.7.0**.

**Purely visual release:** no changes to RNG, 20-turn rules, category values, face bonuses, CALL IT!, sound or radio behavior, or leaderboard storage.

## Face-Value Scoring and Build Plate (v1.6.0)

**Pairs of sixes are more valuable than pairs of ones.** The payout is the old category base plus a deterministic bonus from the faces that qualify:

| Category | Old base | Face bonus | New range |
|---|---:|---|---:|
| Pair | 100 | 10 × matching face | 110–160 |
| Two pair | 200 | 10 × sum of both paired faces | 230–310 |
| Three of a kind | 400 | 20 × matching face | 420–520 |
| Small straight | 600 | Fixed | 600 |
| Large straight | 800 | Fixed | 800 |
| Full house | 1,000 | 20 × tripled face + 10 × paired face | 1,040–1,170 |
| Four of a kind | 2,000 | 50 × matching face | 2,050–2,300 |
| Five of a kind | 5,000 | 100 × matching face | 5,100–5,600 |

Higher-ranked hands remain worth more even across extremes. The app shows actual base and face bonuses in the payout readout, accurate payout ranges on the table, and doubles the **actual called category's payout** for successful CALL IT! challenges. For overlapping qualifying combinations, the bonus belongs to the hand being scored: a declared pair pays the pair rule, even if a later roll makes three of a kind. Scoring is deterministic and does not alter dice odds.

The new readable metal-bottom plate displays **BUILD 1.6.0**. The existing olive paint, lights, sounds, telemetry and rolling animation are unchanged.

**Leaderboard fairness:** scores under v1.6 face-value rules go in a new **local** Top 10 (`luck-machine-leaderboard-v2`), so they are not mixed with the fixed-payout competition. Old local records remain preserved in `luck-machine-leaderboard-v1` and are viewable using **TOP 10 → LEGACY SCORES**. A shared online leaderboard is still planned; nothing here uploads scores.

## Soviet Panel Markings and Legibility (v1.5)

**More period field equipment, less tiny decoration.** The olive-drab cabinet, operational analog needle, channel selector, radio bars, LEDs, and game logic remain unchanged. The instrument panel now uses short, higher-contrast bilingual Russian/English labels (СЧЁТ / SCORE, ХОД / TURN, БРОСКИ / ROLLS, РЕКОРД / BEST), a clearly legible factory/inspection plate, and a fictional Soviet-style apparatus badge. The radio meter, channel indicators, payout table, decision directions, and warning text are more readable.

Redundant micron-sized radio captions, simulation boilerplate on the panel, duplicate serial labels, the unnecessary mobile-unit inscription, and the verbose footer notice were removed. The new `legibility.css` is only for text legibility; it does **not** change the dice odds, scoring values, state management, animations, or audio. The "dynamic per-die face value" scoring refinement and online leaderboard remain future work.

## Active Instrumentation (v1.4)

The analog signal meter and five radio-link strength bars now react to rolls, dice stopping, holds, wagers, banked scores, and successful or unsuccessful called hands. The pointer drifts subtly at idle and swings more during activity.

The black radio selector is a real input rather than a decorative knob. Click or tap it to cycle among nine simulated radio channels, drag horizontally to tune, or focus it and use arrow keys (Home/End select the endpoints). The channel number, simulated link status, and strength display update. Selector movements make restrained radio-static and tuning tones when SOUND is on.

All radio and transmission details are **fictional visual/sound feedback**. Channels do not operate external equipment and do not alter dice odds, scoring, or leaderboard results. The existing visual layout and twenty-turn game are unchanged. People who prefer reduced motion receive mostly stationary instrument readouts.

## Field-Radio Restoration (v1.3)

The cabinet uses a sharp-edged matte olive field-radio chassis, with structural corner plates, separately recessed instrument assemblies, and utilitarian stenciled factory markings. Version 1.3 keeps the handle-free enclosure and removes four fake corner brackets plus the floating decorative top label. The remaining fasteners are flush with the cabinet or actual instrument modules. The new details draw on period Soviet R-159-style field radios: subdued textured olive enamel, recessed analog instrumentation, a black rotary selector and a connector socket. The design avoids shiny case hardware or unnecessary decorative attachments.

The new appearance is layered in `field.css`. The previous handle treatment is no longer loaded. The five square illuminated dice, twenty-turn rules, extended rolling, sound effects, local Top 10, and viewport scaling remain functionally unchanged.

## Military Hardware Restoration

The upright red star now sits on a stamped, riveted equipment plate. Version 0.9 adds weathered olive-drab enamel, cold-war-style milled bezels and screw heads, Bakelite-like radio knob texture, old incandescent-glass-style indicators, heavier mechanical-button treatments, and Cyrillic factory inspection markings. The visual changes are isolated in `hardware.css` and a small header stamp; the dice mechanics, 20-turn rules, sounds, leaderboard, and viewport-fitting logic remain unchanged.

## Sound

Sound is generated locally with Web Audio. The new v0.6 audio engine includes mechanical relay clicks, five staggered dice-stop sounds, tactile HOLD clicks, bank-counting chimes, CALL IT! warnings, success/failure signals, five-of-a-kind fanfare, an end-session sign-off, and infrequent faint idle radio chirps. All audio is controlled by the existing SOUND ON/OFF switch. Gameplay and scores are unchanged.

## Design

The portable command-case framing, antenna/radio details, signal gauges, and remote telemetry are fictional decorative elements; this game does not communicate with or operate real equipment. Runs entirely client-side with no framework or server.

## Deployment

The included GitHub Actions workflow publishes this site to GitHub Pages when commits are pushed to `main`. If setting up for the first time, enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.
