ALTER TABLE project ADD COLUMN project_type VARCHAR(15) NOT NULL DEFAULT 'classic';
ALTER TABLE project ADD COLUMN dashboards VARCHAR(255);