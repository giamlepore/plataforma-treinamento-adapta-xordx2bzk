ALTER TABLE organizations ADD COLUMN IF NOT EXISTS header_title TEXT DEFAULT 'BETSMARTER';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS header_subtitle TEXT DEFAULT 'Course Dashboard';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Advance Your Betting Knowledge';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Access professional-grade courses and validated strategies. Master the mathematics, psychology, and systems of profitable betting.';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS platform_bg_color TEXT DEFAULT '#1a5c48';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Update policies to allow admins to update organization
CREATE POLICY "Admins can update their organization" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update policies to allow admins to full access courses
CREATE POLICY "Admins can insert courses" ON courses
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update courses" ON courses
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete courses" ON courses
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Modules policies for admins
CREATE POLICY "Admins can all modules" ON modules
  FOR ALL USING (
    course_id IN (
      SELECT c.id FROM courses c
      JOIN profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Lessons policies for admins
CREATE POLICY "Admins can all lessons" ON lessons
  FOR ALL USING (
    module_id IN (
      SELECT m.id FROM modules m
      JOIN courses c ON c.id = m.course_id
      JOIN profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
