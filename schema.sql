-- EcoCode Carbon Footprint Analyzer Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code analyses table
CREATE TABLE IF NOT EXISTS code_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    analysis_results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_code_analyses_user_id ON code_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_code_analyses_created_at ON code_analyses(created_at DESC);

-- GitHub repository analyses table
CREATE TABLE IF NOT EXISTS github_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    repo_url TEXT NOT NULL,
    analysis_results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_github_analyses_user_id ON github_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_github_analyses_created_at ON github_analyses(created_at DESC);

-- Hosting impact calculations table
CREATE TABLE IF NOT EXISTS hosting_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    region TEXT NOT NULL,
    tier TEXT NOT NULL,
    calculation_results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_hosting_calculations_user_id ON hosting_calculations(user_id);

-- API usage tracking (for rate limiting and analytics)
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 1,
    last_request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for API usage tracking
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosting_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for code_analyses table
CREATE POLICY "Users can view own analyses"
    ON code_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
    ON code_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
    ON code_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for github_analyses table
CREATE POLICY "Users can view own github analyses"
    ON github_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own github analyses"
    ON github_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own github analyses"
    ON github_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for hosting_calculations table
CREATE POLICY "Users can view own hosting calculations"
    ON hosting_calculations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hosting calculations"
    ON hosting_calculations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for api_usage table
CREATE POLICY "Users can view own api usage"
    ON api_usage FOR SELECT
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_code_analyses', (SELECT COUNT(*) FROM code_analyses WHERE user_id = user_uuid),
        'total_github_analyses', (SELECT COUNT(*) FROM github_analyses WHERE user_id = user_uuid),
        'average_green_score', (
            SELECT AVG((analysis_results->>'green_score')::float)
            FROM code_analyses
            WHERE user_id = user_uuid
        ),
        'total_co2_analyzed', (
            SELECT SUM((analysis_results->>'co2_estimate_grams')::float)
            FROM code_analyses
            WHERE user_id = user_uuid
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional)
-- INSERT INTO users (id, email, full_name) VALUES 
-- (uuid_generate_v4(), 'demo@ecocode.app', 'Demo User');

COMMENT ON TABLE users IS 'User profiles';
COMMENT ON TABLE code_analyses IS 'Code analysis results with carbon footprint metrics';
COMMENT ON TABLE github_analyses IS 'GitHub repository analysis results';
COMMENT ON TABLE hosting_calculations IS 'Hosting provider carbon footprint calculations';
COMMENT ON TABLE api_usage IS 'API usage tracking for rate limiting';
