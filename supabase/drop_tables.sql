-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS video_analytics CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS videos CASCADE;

-- Drop the function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

