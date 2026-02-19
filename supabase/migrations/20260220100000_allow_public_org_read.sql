-- Allow anonymous users to read organization details for invitation/discovery
-- We add a policy that allows SELECT for 'anon' role
CREATE POLICY "Allow public read access" ON organizations
  FOR SELECT
  TO anon
  USING (true);

-- Restrict anonymous users to only read specific columns (id, name, slug)
-- We first revoke the default broad select permission if it exists
REVOKE SELECT ON organizations FROM anon;

-- Then we grant specific column access
GRANT SELECT (id, name, slug) ON organizations TO anon;
