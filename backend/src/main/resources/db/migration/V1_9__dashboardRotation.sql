ALTER TABLE project ADD COLUMN project_type VARCHAR(15) NOT NULL DEFAULT 'DEFAULT';
ALTER TABLE project ADD COLUMN parent bigint DEFAULT NULL;
ALTER TABLE project ADD COLUMN duration INTEGER DEFAULT 10;
