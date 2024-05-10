-- Run this file with sqlite3 like this:
--   sqlite3 src/db/dev.db < src/db/migrations/2024-05-10-190401-first-migration.sql
--
-- sqlite> .tables
-- stored_queries     stored_query_rows


-- Create stored_queries table
CREATE TABLE stored_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  serialized_config TEXT,
  creator_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL,
  started_at DATETIME,
  completed_at DATETIME,
  archived_at DATETIME,
  expire_at DATETIME,
  failed_at DATETIME,
  failed_reason TEXT,
  columns JSON, -- JSON array of columns
  tables JSON -- JSON array of tables
);

-- Create stored_query_rows table
CREATE TABLE stored_query_rows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stored_query_id INTEGER NOT NULL,
  serialized_data TEXT NOT NULL,
  FOREIGN KEY(stored_query_id) REFERENCES stored_queries(id)
);
