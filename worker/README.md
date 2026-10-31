# LUCK MACHINE — Cloudflare Worker (v1.13.0, dashboard deployment)

**Use the existing Cloudflare Worker and D1 database.** The owner uses the Cloudflare dashboard rather than Wrangler. Do **not** recreate or modify the database, reset historic scores, or touch Miami Nights.

## Enable Backwards Bottom 10 (v1.13.0)

The original twelve-turn **Classic Top 10** (`face-v3-12`) remains intact. The new **Backwards Bottom 10** uses a different ruleset (`face-v3-12-backwards`) with ascending score order.

1. Go to **Cloudflare → Workers & Pages → luck-machine-board → Edit Code**.
2. Open the complete [worker/src/index.js](https://github.com/richcande1-rca/luck-machine/blob/main/worker/src/index.js) from the merged 1.13.0 release.
3. Replace the existing Worker's code with that file and click **Deploy**. Keep the existing D1 binding named **DB**, pointing to the same **luck_machine_board** database.
4. Verify both endpoints: [Classic Top 10](https://luck-machine-board.rich-gothic.workers.dev/api/board) should report `face-v3-12`, and [Backwards Bottom 10](https://luck-machine-board.rich-gothic.workers.dev/api/board?ruleset=face-v3-12-backwards) should report `face-v3-12-backwards`. Initially the backwards `entries` array will be empty.
5. No database reset or schema migration is needed. Existing classic scores remain untouched.

**Zero-score compatibility:** The original `luck_machine_entries` table schema contains `CHECK(score > 0)`. Backwards scores are stored as **actual game score + 1** (so zero is stored as 1) and decoded before being sent to the browser. This offset is applied **only** to the Backwards ruleset; classic records and API scores remain unchanged. Ranking ascending is preserved by the offset.

**Important:** Deploying the GitHub Pages game alone does **not** deploy the Cloudflare Worker. Backwards can be played before the Worker update, but worldwide Bottom 10 browsing/posting won't work until the updated Worker is deployed.

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
