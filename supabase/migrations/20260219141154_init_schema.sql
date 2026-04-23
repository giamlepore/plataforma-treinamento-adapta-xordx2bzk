-- Create tables
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  instructor_avatar TEXT,
  duration_text TEXT,
  image_color TEXT,
  image_query TEXT,
  label TEXT,
  rating NUMERIC(2, 1),
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  video_url TEXT,
  is_test BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(profile_id, lesson_id)
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies

-- Profiles
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations (Readable if user belongs to it)
CREATE POLICY "Users can read organization they belong to" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Courses
CREATE POLICY "Users can read courses of their organization" ON courses
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Modules
CREATE POLICY "Users can read modules of their organization" ON modules
  FOR SELECT USING (
    course_id IN (
      SELECT c.id FROM courses c
      JOIN profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid()
    )
  );

-- Lessons
CREATE POLICY "Users can read lessons of their organization" ON lessons
  FOR SELECT USING (
    module_id IN (
      SELECT m.id FROM modules m
      JOIN courses c ON c.id = m.course_id
      JOIN profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid()
    )
  );

-- User Progress
CREATE POLICY "Users can read their own progress" ON user_progress
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can insert/update their own progress" ON user_progress
  FOR ALL USING (profile_id = auth.uid());

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_org_id UUID;
BEGIN
  -- Assign to 'BetSmarter' organization by default
  SELECT id INTO default_org_id FROM public.organizations WHERE slug = 'betsmarter' LIMIT 1;
  
  -- If no org found (should not happen after seed), try any
  IF default_org_id IS NULL THEN
    SELECT id INTO default_org_id FROM public.organizations LIMIT 1;
  END IF;

  INSERT INTO public.profiles (id, organization_id, full_name, role)
  VALUES (
    new.id, 
    default_org_id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED DATA
DO $$
DECLARE
  org_id UUID;
  c_figma UUID;
  c_smart UUID;
  c_data UUID;
  c_mind UUID;
  c_arb UUID;
  c_risk UUID;
  c_auto UUID;
  m_id UUID;
BEGIN
  -- Organization
  INSERT INTO organizations (name, slug) VALUES ('BetSmarter', 'betsmarter') RETURNING id INTO org_id;

  -- Course 1: Figma (Product Design)
  INSERT INTO courses (organization_id, title, description, instructor_name, instructor_avatar, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Mastering Figma in 7 days unleashed', 'Embark on a transformative journey into the dynamic realm of web development with our Front-End Development course.', 'Albert Flores', 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3', '4h 12m', 'bg-brand-yellow', 'figma interface design', 'Product Design', 4.8, 221)
  RETURNING id INTO c_figma;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_figma, 'Get Started with Figma Basics', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Introduction to Figma', '02:15:24', 0),
    (m_id, 'Utilizing Figma''s Powerful Features', '02:15:24', 1),
    (m_id, 'Mastering Autolayout', '02:15:24', 2),
    (m_id, 'Topical examination', '02:15:24', 3);
  
  INSERT INTO modules (course_id, title, order_index) VALUES (c_figma, 'Figma components', 1) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index, is_locked) VALUES 
    (m_id, 'Component Properties', '45:00', 0, true),
    (m_id, 'Variants and State', '55:00', 1, true);

  INSERT INTO modules (course_id, title, order_index) VALUES (c_figma, 'Create your own design system', 2) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index, is_locked) VALUES 
    (m_id, 'Color Styles', '35:00', 0, true),
    (m_id, 'Typography', '40:00', 1, true);

  -- Course 2: Smart Betting 101
  INSERT INTO courses (organization_id, title, description, instructor_name, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Smart Betting 101', 'Master the fundamentals of smart betting. Learn how to read odds, understand probability, and manage your bankroll effectively.', 'A. Silva', '4h 30m', 'bg-emerald-600', 'library books study', 'Fundamentals', 4.5, 120)
  RETURNING id INTO c_smart;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_smart, 'Introduction to Betting', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Understanding Odds Formats', '15:00', 0),
    (m_id, 'Probability Basics', '20:00', 1),
    (m_id, 'Types of Bets', '12:00', 2);

  INSERT INTO modules (course_id, title, order_index) VALUES (c_smart, 'Bankroll Management', 1) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Setting a Budget', '18:00', 0),
    (m_id, 'Staking Plans', '25:00', 1),
    (m_id, 'ROI vs Yield', '14:00', 2);

  -- Course 3: Data-Driven Decisions
  INSERT INTO courses (organization_id, title, description, instructor_name, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Data-Driven Decisions', 'Learn to use data analytics to make informed betting decisions.', 'Dr. Ray', '6h 15m', 'bg-blue-600', 'stock market chart', 'Analytics', 4.7, 85)
  RETURNING id INTO c_data;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_data, 'Data Sources', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Finding Reliable Data', '22:00', 0),
    (m_id, 'Scraping Odds', '30:00', 1);

  INSERT INTO modules (course_id, title, order_index) VALUES (c_data, 'Analysis Techniques', 1) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Trend Analysis', '45:00', 0),
    (m_id, 'Statistical Models', '50:00', 1);

  -- Course 4: Mindset of a Winner
  INSERT INTO courses (organization_id, title, description, instructor_name, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Mindset of a Winner', 'Psychology plays a huge role in betting. Learn how to control emotions.', 'S. De Haan', '3h 20m', 'bg-purple-600', 'brain synapses abstract', 'Psychology', 4.9, 310)
  RETURNING id INTO c_mind;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_mind, 'Psychology Basics', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Emotional Control', '20:00', 0),
    (m_id, 'The Gambler''s Fallacy', '15:00', 1);

  -- Course 5: Arbitrage & Value
  INSERT INTO courses (organization_id, title, description, instructor_name, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Arbitrage & Value', 'Advanced strategies to find value bets and arbitrage opportunities.', 'M. Kneebone', '8h 00m', 'bg-rose-600', 'chess strategy board', 'Advanced Strategy', 4.6, 98)
  RETURNING id INTO c_arb;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_arb, 'Value Betting', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Defining Value', '30:00', 0),
    (m_id, 'Calculating Expected Value', '40:00', 1);

  -- Course 6: Professional Risk Management
  INSERT INTO courses (organization_id, title, description, instructor_name, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Professional Risk Management', 'Advanced strategies for managing risk in professional betting environments.', 'N. Mihaljevic', '12h 45m', 'bg-orange-600', 'financial safe vault', 'Featured Masterclass', 5.0, 42)
  RETURNING id INTO c_risk;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_risk, 'Risk Assessment', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'Quantifying Risk', '45:00', 0),
    (m_id, 'Hedging Strategies', '50:00', 1);

  -- Course 7: Automated Systems
  INSERT INTO courses (organization_id, title, description, instructor_name, duration_text, image_color, image_query, label, rating, reviews)
  VALUES (org_id, 'Automated Systems', 'Build and deploy automated betting systems using APIs and bots.', 'Bot Labs', '5h 30m', 'bg-cyan-600', 'futuristic hud interface', 'Technology', 4.4, 67)
  RETURNING id INTO c_auto;

  INSERT INTO modules (course_id, title, order_index) VALUES (c_auto, 'Automation Basics', 0) RETURNING id INTO m_id;
  INSERT INTO lessons (module_id, title, duration, order_index) VALUES 
    (m_id, 'API Integration', '35:00', 0),
    (m_id, 'Bot Logic', '45:00', 1);
    
END $$;
