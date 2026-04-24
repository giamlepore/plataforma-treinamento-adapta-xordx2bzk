-- Create helper functions to avoid subqueries directly in policies,
-- preventing Postgres pg_get_expr from forcing newlines into the generated SQL output.
-- The original dynamic DO block that rewrote pg_policies was removed because
-- the regex-based paren counting was unreliable across different policy shapes.
-- Use these functions in future policies directly.

CREATE OR REPLACE FUNCTION public.is_org_admin(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.organization_id = org_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.organization_id = org_id
  );
$$;
