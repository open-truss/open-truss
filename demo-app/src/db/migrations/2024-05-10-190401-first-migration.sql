-- Run this file with mysql like this:
--   mysql -u <username> -p $MYSQL_PASS_FROM_ENV -h <host> <database> < \
--     demo-app/src/db/migrations/2024-05-10-190401-first-migration.sql
--
-- mysql > show tables;
-- + --------------------+
-- | Tables_in_demo_app  |
-- + --------------------+
-- | stored_queries      |
-- | stored_query_rows   |
-- + --------------------+
-- 2 rows in set (0.01 sec)

-- Create demo_app database
CREATE DATABASE IF NOT EXISTS demo_app;

-- Use demo_app database
USE demo_app;

-- Create stored_queries table
CREATE TABLE stored_queries (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  query TEXT NOT NULL,
  name VARCHAR(255),
  description TEXT,
  serialized_config JSON NOT NULL DEFAULT (JSON_OBJECT()),
  expire_at DATETIME NOT NULL,
  creator_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  archived_at DATETIME,
  failed_at DATETIME,
  failed_reason TEXT,
  columns JSON NOT NULL DEFAULT (JSON_OBJECT()),
  tables JSON NOT NULL DEFAULT (JSON_ARRAY())
) ENGINE=InnoDB;

-- Create stored_query_rows table
CREATE TABLE stored_query_rows (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  stored_query_id BIGINT NOT NULL,
  serialized_data JSON,
  FOREIGN KEY(stored_query_id) REFERENCES stored_queries(id)
) ENGINE=InnoDB;
