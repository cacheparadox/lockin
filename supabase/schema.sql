-- Supabase Database Schema for Lock In

-- Enums
CREATE TYPE task_category AS ENUM ('FITNESS', 'DEEP_WORK', 'BUSINESS', 'STUDY', 'CREATIVE', 'HEALTH', 'CUSTOM');
CREATE TYPE task_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXTREME', 'LEGENDARY');
CREATE TYPE contract_state AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED');
CREATE TYPE user_state AS ENUM ('ACTIVE', 'COOLING', 'RUSTING');

-- Profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    title TEXT DEFAULT 'Wanderer',
    current_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    reputation_score INTEGER DEFAULT 0,
    status user_state DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Groups
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    invite_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Group Members
CREATE TABLE group_members (
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')) DEFAULT 'MEMBER',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (group_id, user_id)
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category task_category NOT NULL,
    difficulty task_difficulty NOT NULL,
    proof_requirement TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    is_personal BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Task Proofs
CREATE TABLE task_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT,
    caption TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contracts
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_metric TEXT,
    target_value INTEGER,
    current_value INTEGER DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    reward_xp INTEGER NOT NULL,
    optional_stake TEXT,
    state contract_state DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- War Room Posts
CREATE TABLE war_room_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Profiles
CREATE TABLE ai_profiles (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    main_quest TEXT NOT NULL,
    fitness_multiplier DECIMAL DEFAULT 1.0,
    deep_work_multiplier DECIMAL DEFAULT 1.0,
    business_multiplier DECIMAL DEFAULT 1.0,
    study_multiplier DECIMAL DEFAULT 1.0,
    creative_multiplier DECIMAL DEFAULT 1.0,
    health_multiplier DECIMAL DEFAULT 1.0,
    custom_multiplier DECIMAL DEFAULT 1.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (simplified for setup)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_room_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_profiles ENABLE ROW LEVEL SECURITY;
