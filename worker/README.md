# LUCK MACHINE — Cloudflare Worker (v1.10.0, dashboard deployment)

**Use the existing Cloudflare Worker and D1 database.** The owner uses the Cloudflare dashboard rather than Wrangler. Do **not** recreate or modify the database, reset historic scores, or touch Miami Nights.

## Upgrade to the twelve-turn collection competition

1. Go to **Cloudflare → Workers & Pages → luck-machine-board → Edit Code**.
2. Open [worker/src/index.js](https://github.com/richcande1-rca/luck-machine/blob/main/worker/src/index.js) after v1.10.0 is merged.
3. Replace the Worker's code with the **entire file** and click **Deploy**.
4. Verify its existing **Production D1 binding** is still named `DB` and points to `luck_machine_board`.
5. Visit https://luck-machine-board.rich-gothic.workers.dev/api/board and verify `ok:true`, `game:"luck-machine"`, `ruleset:"face-v2-12"` and an `entries` array.
6. Verify the historic read-only boards still work at `/api/board?ruleset=face-v1-10` and `/api/board?ruleset=face-v1`.

The Worker uses the same `luck_machine_entries` table. **No SQL migration is required.** Previous scores and ruleset partitions are untouched.

## Rulesets and limits

| API | Ruleset | Behavior |
| --- | --- | --- |
| GET /api/board | face-v2-12 (default) | Current twelve-turn collection Top 10 |
| POST /api/board | face-v2-12 | Submit a current twelve-turn score |
| GET /api/board?ruleset=face-v1-10 | face-v1-10 | Read-only previous ten-turn Top 10 |
| GET /api/board?ruleset=face-v1 | face-v1 | Read-only historic twenty-turn Top 10 |
| POST with either older ruleset | face-v1-10 / face-v1 | Rejected |

Maximum allowed score: **159,400**, a conservative theoretical upper bound: twelve turns × maximum double five-of-a-kind (2 × 5,600) plus a one-time 25,000-point eight-hand collection bonus. An exact twelve-turn maximum under all hand-collection constraints may be lower.

The frontend shows **Cloudflare Worker update required** for new world records until the Worker is deployed. Offline and not-yet-upgraded Workers do not prevent gameplay or local scores. Anonymous browser-reported scores are not tamper-proof.

## Local score keys (all independent)

- `luck-machine-leaderboard-v4-twelve-turn` — current twelve-turn collection results.
- `luck-machine-leaderboard-v3-ten-turn` — earlier ten-turn results.
- `luck-machine-leaderboard-v2` — older twenty-turn face-value scores.
- `luck-machine-leaderboard-v1` — pre-1.6 fixed-payout scores.

**Important:** Edit only the LUCK MACHINE Worker. The Miami Nights Worker and leaderboard are separate. Never include Cloudflare credentials in GitHub files.
