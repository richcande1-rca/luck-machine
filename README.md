# LUCK MACHINE — Model 5D-20

A retro-industrial browser dice game styled as a fictional Soviet-era long-range command console. **Version 0.6 — Audio System Overhaul.**

## Play

[Open LUCK MACHINE](https://richcande1-rca.github.io/luck-machine/) (requires GitHub Pages to be enabled in repository settings).

Or download `index.html` and `audio.js` together in the same folder and open `index.html` in a modern browser. No installation or build process is needed.

## Rules

- Five illuminated dice, each with its own HOLD control.
- Three rolls per turn, 20 turns per game.
- Score repeatable poker-style dice combinations.
- Bank your hand for points, or **CALL YOUR HAND** before your final roll to attempt a better combination for double the payout; a failed call scores zero for the turn.
- Local Top 10 leaderboard stored in this browser only; scores are **not shared online**.

Keyboard: **Space / Enter** = roll, **1–5** = hold corresponding die, **B** = bank, **C** = call.

## Sound

Sound is generated locally with Web Audio. The new v0.6 audio engine includes mechanical relay clicks, five staggered dice-stop sounds, tactile HOLD clicks, bank-counting chimes, CALL IT! warnings, success/failure signals, five-of-a-kind fanfare, an end-session sign-off, and infrequent faint idle radio chirps. All audio is controlled by the existing SOUND ON/OFF switch. Gameplay and scores are unchanged.

## Design

The portable command-case framing, antenna/radio details, signal gauges, and remote telemetry are fictional decorative elements; this game does not communicate with or operate real equipment. Runs entirely client-side with no framework or server.

## Deployment

The included GitHub Actions workflow publishes this site to GitHub Pages when commits are pushed to `main`. If setting up for the first time, enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.
