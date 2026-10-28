# LUCK MACHINE — Cloudflare Worker (v1.11.0, dashboard deployment)

**Use the existing Cloudflare Worker and D1 database.** The owner uses the Cloudflare dashboard rather than Wrangler. Do **not** recreate or modify the database, reset historic scores, or touch Miami Nights.

## Upgrade to the twelve-turn repeat-hand competition

1. Go to **Cloudflare → Workers & Pages → luck-machine-board → Edit Code**.
2. Open [worker/src/index.js](https://github.com/richcande1-rca/luck-machine/blob/main/worker/src/index.js) after v1.11.0 is merged.
3. Replace the Worker's code with the **entire file** and click **Deploy**.
4. Verify its existing **Production D1 binding** is still named `DB` and points to `luck_machine_board`.
5. Visit https://luck-machine-board.rich-gothic.workers.dev/api/board and verify `ok:true`, `game:"luck-machine"`, `ruleset:"face-v3-12"` and an `entries` array.
6. Verify the prior twelve-turn board still works read-only at `/api/board?ruleset=face-v2-12`, along with `/api/board?ruleset=face-v1-10` and `/api/board?ruleset=face-v1`.

The Worker uses the same `luck_machine_entries` table. **No SQL migration is required.** Previous scores and ruleset partitions are untouched.

## Rulesets and limits

| API | Ruleset | Behavior |
| --- | --- | --- |
| GET /api/board | face-v3-12 (default) | Current twelve-turn repeat-hand Top 10 |
| POST /api/board | face-v3-12 | Submit a current repeat-hand score |
| GET /api/board?ruleset=face-v2-12 | face-v2-12 | Read-only prior twelve-turn collection Top 10 |
| GET /api/board?ruleset=face-v1-10 | face-v1-10 | Read-only previous ten-turn Top 10 |
| GET /api/board?ruleset=face-v1 | face-v1 | Read-only historic twenty-turn Top 10 |
| POST with any older ruleset | face-v2-12 / face-v1-10 / face-v1 | Rejected |

Maximum allowed score: **504,000**, the theoretical ceiling for twelve successfully called five-of-a-kind hands: 11,200 points times the sum of repeat multipliers 1 + 1.5 + … + 6.5 = 45. The 25,000-point collection bonus cannot be earned when all twelve turns bank the same hand. The Worker validates only basic bounds, not individual turn histories.

The frontend shows **Cloudflare Worker update required** for new world records until the Worker is deployed. Offline and not-yet-upgraded Workers do not prevent gameplay, but no scores can be posted until the Worker is updated. Anonymous browser-reported scores are not tamper-proof.

## Historical records

Previously stored D1 score partitions are preserved. The game now displays only the current online board; no local scoreboard is offered. Existing browser-local keys, if any, are left untouched.

**Important:** Edit only the LUCK MACHINE Worker. The Miami Nights Worker and leaderboard are separate. Never include Cloudflare credentials in GitHub files.
