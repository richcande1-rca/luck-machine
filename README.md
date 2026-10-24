# LUCK MACHINE — Model 5D-20

A retro-industrial browser dice game styled as a fictional Soviet-era long-range command console. **Version 1.5 — Soviet Panel Markings and Legibility.**

## Play

[Open LUCK MACHINE](https://richcande1-rca.github.io/luck-machine/) (requires GitHub Pages to be enabled in repository settings).

Or download `index.html`, `audio.js`, `hardware.css`, `field.css`, `telemetry.css`, `telemetry.js`, and `legibility.css` together in the same folder and open `index.html` in a modern browser. No installation or build process is needed.

## Rules

- Five illuminated dice, each with its own HOLD control.
- Three rolls per turn, 20 turns per game.
- Score repeatable poker-style dice combinations.
- Bank your hand for points, or **CALL YOUR HAND** before your final roll to attempt a better combination for double the payout; a failed call scores zero for the turn.
- Local Top 10 leaderboard stored in this browser only; scores are **not shared online**.

Keyboard: **Space / Enter** = roll, **1–5** = hold corresponding die, **B** = bank, **C** = call.

## Version 0.9

The five illuminated dice faces have a square 1:1 aspect ratio on desktop and mobile. Every roll, including the first roll of each turn, now uses the same longer stepped electronic cycling (about 1.3–1.9 seconds, depending on how many dice are rolling). Gameplay probabilities and scoring remain unchanged.

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
