-- Update handle_new_user to support joining existing organizations
-- If organization_id is provided in metadata, join it as student
-- Otherwise, create new organization as admin

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id uuid;
  org_name text;
  base_slug text;
  final_slug text;
  full_name text;
  provided_org_id uuid;
BEGIN
  full_name := new.raw_user_meta_data->>'full_name';
  
  -- Check for organization_id in metadata
  -- Safely cast if needed, though usually it's string in JSON
  BEGIN
    provided_org_id := (new.raw_user_meta_data->>'organization_id')::uuid;
  EXCEPTION WHEN OTHERS THEN
    provided_org_id := NULL;
  END;

  IF provided_org_id IS NOT NULL THEN
     -- User is joining an existing organization
     INSERT INTO public.profiles (id, full_name, organization_id, role)
     VALUES (new.id, full_name, provided_org_id, 'student')
     ON CONFLICT (id) DO NOTHING;
  ELSE
     -- User is creating a new organization
     org_name := COALESCE(new.raw_user_meta_data->>'org_name', 'My Organization');
     
     -- Generate a URL-friendly slug from the organization name
     base_slug := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g');
     base_slug := trim(both '-' from base_slug);
     
     -- Ensure base_slug is not empty
     IF base_slug = '' OR base_slug IS NULL THEN
       base_slug := 'org';
     END IF;
   
     -- Append a random string to guarantee uniqueness
     final_slug := base_slug || '-' || substr(md5(random()::text), 1, 6);
   
     INSERT INTO public.organizations (name, slug)
     VALUES (org_name, final_slug)
     RETURNING id INTO new_org_id;
   
     INSERT INTO public.profiles (id, full_name, organization_id, role)
     VALUES (new.id, full_name, new_org_id, 'admin')
     ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Silently handle errors so user creation doesn't fail
    RETURN new;
END;
$$;
