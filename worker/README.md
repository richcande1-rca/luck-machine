# LUCK MACHINE — Cloudflare Worker (v1.9.0, dashboard deployment)

**The owner uses the Cloudflare dashboard, not Wrangler.** The Worker and D1
database already exist. You do **not** need to create another database, alter
the SQL schema, reset scores, or touch Miami Nights.

## One-time upgrade for the new ten-turn game

1. Open **Cloudflare → Workers & Pages → luck-machine-board → Edit Code**.
2. Open https://github.com/richcande1-rca/luck-machine/blob/main/worker/src/index.js
3. Replace the existing Worker's code with **the entire contents** of that file.
4. Click **Deploy**.
5. Confirm that the Worker still has a **Production D1 binding** with variable
   name exactly `DB` pointing to the **existing** `luck_machine_board` database.
6. Visit https://luck-machine-board.rich-gothic.workers.dev/api/board
   The response should contain `ok:true`, `game:luck-machine`,
   `ruleset:face-v1-10`, `limit:10`, and an `entries` array.
7. Verify the old ranking is still at
   https://luck-machine-board.rich-gothic.workers.dev/api/board?ruleset=face-v1
   Its response should report `ruleset:face-v1` and any old entries.

**No SQL update is necessary.** The existing `luck_machine_entries` table
already contains a `ruleset` column and supports both twenty-turn and
ten-turn scores. Nothing is deleted or migrated.

## Behavior

| Operation | Ruleset | Result |
| --- | --- | --- |
| GET /api/board | face-v1-10 (default) | Current ten-turn Top 10 |
| POST /api/board | face-v1-10 | Submit a ten-turn score |
| GET /api/board?ruleset=face-v1 | face-v1 | Read-only historic twenty-turn Top 10 |
| POST /api/board with face-v1 | face-v1 | Rejected: historic records are frozen |

Ten turns × the maximum double five-of-a-kind payout (11200) = **112000**
maximum score. The old twenty-turn competition stays separate. Accidental
duplicate retries are handled as before.

Until you paste the new Worker code in Cloudflare, the frontend displays
**Cloudflare Worker update required** for ten-turn world records, while
allowing local ten-turn scores. The old archive can still be read.

## Local score keys

- `luck-machine-leaderboard-v3-ten-turn` — new ten-turn scores.
- `luck-machine-leaderboard-v2` — older twenty-turn face-value scores.
- `luck-machine-leaderboard-v1` — pre-1.6 fixed-payout scores.

All archives remain accessible through the game's leaderboard menus.

**Important:** Edit the LUCK MACHINE Worker only. Do not alter the Miami
Nights Worker, D1 database, or leaderboard. Browser-reported scores aren't
cryptographically verified; do not paste credentials into public files.
