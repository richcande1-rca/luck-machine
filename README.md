# LUCK MACHINE — Model 5D-20

A retro-industrial browser dice game styled as a fictional Soviet-era long-range command console. **Version 0.9 — Military Hardware Restoration.**

## Play

[Open LUCK MACHINE](https://richcande1-rca.github.io/luck-machine/) (requires GitHub Pages to be enabled in repository settings).

Or download `index.html`, `audio.js`, and `hardware.css` together in the same folder and open `index.html` in a modern browser. No installation or build process is needed.

## Rules

- Five illuminated dice, each with its own HOLD control.
- Three rolls per turn, 20 turns per game.
- Score repeatable poker-style dice combinations.
- Bank your hand for points, or **CALL YOUR HAND** before your final roll to attempt a better combination for double the payout; a failed call scores zero for the turn.
- Local Top 10 leaderboard stored in this browser only; scores are **not shared online**.

Keyboard: **Space / Enter** = roll, **1–5** = hold corresponding die, **B** = bank, **C** = call.

## Version 0.9

The five illuminated dice faces have a square 1:1 aspect ratio on desktop and mobile. Every roll, including the first roll of each turn, now uses the same longer stepped electronic cycling (about 1.3–1.9 seconds, depending on how many dice are rolling). Gameplay probabilities and scoring remain unchanged.

## Military Hardware Restoration

The upright red star now sits on a stamped, riveted equipment plate. Version 0.9 adds weathered olive-drab enamel, cold-war-style milled bezels and screw heads, Bakelite-like radio knob texture, old incandescent-glass-style indicators, heavier mechanical-button treatments, and Cyrillic factory inspection markings. The visual changes are isolated in `hardware.css` and a small header stamp; the dice mechanics, 20-turn rules, sounds, leaderboard, and viewport-fitting logic remain unchanged.

## Sound

Sound is generated locally with Web Audio. The new v0.6 audio engine includes mechanical relay clicks, five staggered dice-stop sounds, tactile HOLD clicks, bank-counting chimes, CALL IT! warnings, success/failure signals, five-of-a-kind fanfare, an end-session sign-off, and infrequent faint idle radio chirps. All audio is controlled by the existing SOUND ON/OFF switch. Gameplay and scores are unchanged.

## Design

The portable command-case framing, antenna/radio details, signal gauges, and remote telemetry are fictional decorative elements; this game does not communicate with or operate real equipment. Runs entirely client-side with no framework or server.

## Deployment

The included GitHub Actions workflow publishes this site to GitHub Pages when commits are pushed to `main`. If setting up for the first time, enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.
