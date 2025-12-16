-- ContextType Database Schema
-- Initial database setup for PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    study_group VARCHAR(50) CHECK (study_group IN ('adaptive', 'static', 'control')),
    age_range VARCHAR(20),
    typing_experience VARCHAR(50),
    programming_experience VARCHAR(50),
    consent_given BOOLEAN DEFAULT FALSE,
    demographics JSONB
);

-- Sessions table
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    keyboard_type VARCHAR(20) CHECK (keyboard_type IN ('adaptive', 'static')),
    tasks_completed UUID[]
);

-- Tasks table
CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(20) CHECK (task_type IN ('code', 'email', 'chat')),
    description TEXT NOT NULL,
    target_text TEXT,
    expected_duration INTEGER, -- in seconds
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Keystrokes table (time-series data)
CREATE TABLE keystrokes (
    keystroke_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    key VARCHAR(10) NOT NULL,
    context_mode VARCHAR(20) CHECK (context_mode IN ('code', 'email', 'chat')),
    is_error BOOLEAN DEFAULT FALSE,
    correction BOOLEAN DEFAULT FALSE,
    key_duration FLOAT -- in milliseconds
);

-- Create index for time-series queries
CREATE INDEX idx_keystrokes_session_timestamp ON keystrokes(session_id, timestamp DESC);
CREATE INDEX idx_keystrokes_timestamp ON keystrokes(timestamp DESC);

-- Context detections table
CREATE TABLE context_detections (
    detection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    text_sample TEXT, -- last 100 characters
    detected_context VARCHAR(20) CHECK (detected_context IN ('code', 'email', 'chat')),
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    previous_context VARCHAR(20),
    features JSONB -- keyword counts, patterns, etc.
);

CREATE INDEX idx_context_detections_session ON context_detections(session_id, timestamp DESC);

-- Performance metrics table
CREATE TABLE performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(task_id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    wpm FLOAT,
    error_rate FLOAT,
    context_mode VARCHAR(20) CHECK (context_mode IN ('code', 'email', 'chat'))
);

CREATE INDEX idx_performance_metrics_session ON performance_metrics(session_id, timestamp DESC);

-- Task completions table
CREATE TABLE task_completions (
    completion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(task_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    completion_time INTEGER, -- in seconds
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    comments TEXT
);

-- Questionnaire responses table
CREATE TABLE questionnaire_responses (
    response_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
    questionnaire_type VARCHAR(50), -- 'pre-study', 'post-task', 'post-study', 'sus'
    responses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Keyboard layouts table (for versioning and customization)
CREATE TABLE keyboard_layouts (
    layout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mode VARCHAR(20) CHECK (mode IN ('code', 'email', 'chat')),
    version VARCHAR(10) NOT NULL,
    layout_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default keyboard layouts (simplified versions)
INSERT INTO keyboard_layouts (mode, version, layout_config, is_active) VALUES
('code', '1.0', '{
    "mode": "code",
    "theme": "code_blue",
    "primaryKeys": ["{", "}", "(", ")", "[", "]", "=", ";", ":", "."],
    "features": ["autocomplete", "syntax_snippets"]
}', TRUE),
('email', '1.0', '{
    "mode": "email",
    "theme": "professional_gray",
    "primaryKeys": [".", ",", ";", ":", "!", "?"],
    "features": ["templates", "signatures"]
}', TRUE),
('chat', '1.0', '{
    "mode": "chat",
    "theme": "vibrant",
    "primaryKeys": ["!", "?", "...", "😊", "😂", "❤️", "👍"],
    "features": ["emoji_picker", "abbreviations"]
}', TRUE);

-- Insert sample tasks for testing
INSERT INTO tasks (task_type, description, target_text, expected_duration, difficulty_level) VALUES
('code', 'Write a function to calculate Fibonacci sequence', 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}', 300, 2),
('email', 'Write a professional meeting request email', NULL, 240, 1),
('chat', 'Tell your friend about getting concert tickets', NULL, 180, 1);

-- Create views for analytics

-- View: Session statistics
CREATE VIEW session_stats AS
SELECT
    s.session_id,
    s.user_id,
    s.keyboard_type,
    s.start_time,
    s.end_time,
    EXTRACT(EPOCH FROM (s.end_time - s.start_time)) AS duration_seconds,
    COUNT(DISTINCT k.keystroke_id) AS total_keystrokes,
    AVG(pm.wpm) AS avg_wpm,
    AVG(pm.error_rate) AS avg_error_rate,
    array_length(s.tasks_completed, 1) AS tasks_completed_count
FROM sessions s
LEFT JOIN keystrokes k ON s.session_id = k.session_id
LEFT JOIN performance_metrics pm ON s.session_id = pm.session_id
GROUP BY s.session_id, s.user_id, s.keyboard_type, s.start_time, s.end_time, s.tasks_completed;

-- View: Context distribution per session
CREATE VIEW context_distribution AS
SELECT
    cd.session_id,
    cd.detected_context,
    COUNT(*) AS detection_count,
    AVG(cd.confidence_score) AS avg_confidence
FROM context_detections cd
GROUP BY cd.session_id, cd.detected_context;

COMMENT ON TABLE users IS 'Stores user information and demographics for study participants';
COMMENT ON TABLE sessions IS 'Tracks individual typing sessions';
COMMENT ON TABLE keystrokes IS 'Logs every keystroke for detailed analysis';
COMMENT ON TABLE context_detections IS 'Records context detection events and confidence scores';
COMMENT ON TABLE performance_metrics IS 'Aggregated performance metrics calculated periodically';
COMMENT ON TABLE tasks IS 'Predefined tasks for user study';
COMMENT ON TABLE keyboard_layouts IS 'Configuration for different keyboard modes';
