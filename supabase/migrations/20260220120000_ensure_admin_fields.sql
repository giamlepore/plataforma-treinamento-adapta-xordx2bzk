ALTER TABLE organizations ADD COLUMN IF NOT EXISTS header_title TEXT DEFAULT 'BETSMARTER';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS header_subtitle TEXT DEFAULT 'Course Dashboard';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Advance Your Betting Knowledge';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Access professional-grade courses and validated strategies. Master the mathematics, psychology, and systems of profitable betting.';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS platform_bg_color TEXT DEFAULT '#1a5c48';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
