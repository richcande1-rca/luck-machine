# LUCK MACHINE World Top 10 — Cloudflare deployment

This is a **separate** Cloudflare Worker and D1 database for LUCK MACHINE.
It does **not** share the pinball Worker, database, or table. No pinball scores are modified.

## First-time setup (Cloudflare account rich-gothic)

Requires Node.js/npm, Cloudflare account access, and Wrangler.
From the worker directory:

1. npm install
2. npx wrangler login
3. npx wrangler d1 create luck_machine_board
4. Copy the returned database_id to worker/wrangler.toml, replacing REPLACE_WITH_YOUR_LUCK_MACHINE_D1_ID.
5. npm run db:init:remote — creates only luck_machine_entries.
6. npm run deploy

The Worker name is luck-machine-board. If Cloudflare uses the same rich-gothic
workers.dev subdomain as Miami Nights, the frontend is configured to expect:

    https://luck-machine-board.rich-gothic.workers.dev/api/board

**That URL is a deployment target, not proof the Worker already exists.**
Checking it should return JSON containing ok:true, game:luck-machine and an entries array.
The frontend will say WORLD BOARD OFFLINE until the Worker is deployed and reachable.
If the subdomain differs, update ENDPOINT in world-board.js and its versioned script URL
in index.html.

## Behavior

- GET /api/board -> worldwide Top 10, descending; ties go to the older record.
- POST /api/board -> {"initials":"RCA","score":34120,"build":"1.8.0","ruleset":"face-v1"}.
- Validates 1–5 uppercase alphanumeric initials, integer score (1–224000), build,
  scoring ruleset, and Top 10 qualification. Detects accidental duplicate posts within
  five minutes and prunes to ten entries.
- Allowed browser origins: https://richcande1-rca.github.io and local development.
- Offline: game runs normally and can save local scores in luck-machine-leaderboard-v2.
  Scores from before face-value scoring remain separately accessible as legacy records.

## Important: score integrity

As with the original Miami Nights Worker, this anonymous arcade leaderboard accepts
browser-reported scores. They are **not cryptographically verified**; forged submissions
are possible. Validation and a maximum-score ceiling reduce accidents, not cheating.
For rigorous competition, the server should generate/verify all random rolls and full
turn logs and employ rate limiting.

Do not embed Cloudflare tokens or database credentials in the public game.
Deploy from your Cloudflare account or a CI workflow with protected secrets.
