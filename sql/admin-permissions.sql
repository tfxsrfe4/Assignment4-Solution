-- Run this script using a MySQL administrator account.
-- Change the password before running this script.
CREATE USER IF NOT EXISTS 'store_manager'@'localhost'
IDENTIFIED BY 'ChangeThis_StrongPassword123!';

-- Requirement: grant SELECT, INSERT, UPDATE on all tables.
GRANT SELECT, INSERT, UPDATE ON retail_store.* TO 'store_manager'@'localhost';

-- Requirement: revoke UPDATE.
REVOKE UPDATE ON retail_store.* FROM 'store_manager'@'localhost';

-- Requirement: grant DELETE only on the Sales table.
GRANT DELETE ON retail_store.Sales TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;

-- Final intended permissions:
-- SELECT and INSERT on all tables, DELETE on Sales, no UPDATE permission.
