-- Create helper functions to avoid subqueries directly in policies, 
-- preventing Postgres pg_get_expr from forcing newlines into the generated SQL output.

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

-- Dynamically fix all policies that contain newlines in their USING or WITH CHECK clauses
DO $$
DECLARE
    p record;
    drop_stmt text;
    create_stmt text;
    role_str text;
    new_qual text;
    new_with_check text;
BEGIN
    FOR p IN
        SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        new_qual := p.qual;
        new_with_check := p.with_check;
        
        -- Check if either qual or with_check contains a newline character
        IF (new_qual IS NOT NULL AND new_qual ~ '\n') OR 
           (new_with_check IS NOT NULL AND new_with_check ~ '\n') THEN
           
            drop_stmt := format('DROP POLICY %I ON %I.%I;', p.policyname, p.schemaname, p.tablename);
            SELECT string_agg(quote_ident(r), ', ') INTO role_str FROM unnest(p.roles) r;
            
            create_stmt := format('CREATE POLICY %I ON %I.%I AS %s FOR %s TO %s', 
                p.policyname, p.schemaname, p.tablename, p.permissive, p.cmd, role_str);
                
            -- Replace problematic subqueries with clean function calls
            IF new_qual IS NOT NULL THEN
                new_qual := regexp_replace(
                    new_qual,
                    '(?s)organization_id IN \(\s*SELECT profiles\.organization_id.*?''admin''::text\)+',
                    'public.is_org_admin(organization_id)',
                    'g'
                );
                new_qual := regexp_replace(
                    new_qual,
                    '(?s)organization_id IN \(\s*SELECT profiles\.organization_id.*?auth\.uid\(\)\)+',
                    'public.is_org_member(organization_id)',
                    'g'
                );
                -- Fallback to strip out remaining newlines directly
                new_qual := regexp_replace(new_qual, '\n\s*', ' ', 'g');
                create_stmt := create_stmt || ' USING (' || new_qual || ')';
            END IF;
            
            IF new_with_check IS NOT NULL THEN
                new_with_check := regexp_replace(
                    new_with_check,
                    '(?s)organization_id IN \(\s*SELECT profiles\.organization_id.*?''admin''::text\)+',
                    'public.is_org_admin(organization_id)',
                    'g'
                );
                new_with_check := regexp_replace(
                    new_with_check,
                    '(?s)organization_id IN \(\s*SELECT profiles\.organization_id.*?auth\.uid\(\)\)+',
                    'public.is_org_member(organization_id)',
                    'g'
                );
                -- Fallback to strip out remaining newlines directly
                new_with_check := regexp_replace(new_with_check, '\n\s*', ' ', 'g');
                create_stmt := create_stmt || ' WITH CHECK (' || new_with_check || ')';
            END IF;
            
            create_stmt := create_stmt || ';';
            
            EXECUTE drop_stmt;
            EXECUTE create_stmt;
        END IF;
    END LOOP;
END;
$$;
