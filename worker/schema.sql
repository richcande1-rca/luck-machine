-- LUCK MACHINE only. Does not read or modify any Miami Nights data.
CREATE TABLE IF NOT EXISTS luck_machine_entries (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 initials TEXT NOT NULL,
 score INTEGER NOT NULL CHECK(score > 0 AND score <= 224000),
 build TEXT NOT NULL,
 ruleset TEXT NOT NULL DEFAULT 'face-v1',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_luck_machine_rank ON luck_machine_entries(ruleset,score DESC,created_at ASC,id ASC);
