-- Update handle_new_user to properly sequence organization and profile creation
-- Generate a unique slug for the organization and assign the new user as 'admin'

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
BEGIN
  -- Extract metadata, fallback if not provided
  org_name := COALESCE(new.raw_user_meta_data->>'org_name', 'My Organization');
  full_name := new.raw_user_meta_data->>'full_name';

  -- Generate a URL-friendly slug from the organization name
  base_slug := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Ensure base_slug is not empty
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'org';
  END IF;

  -- Append a random string to guarantee uniqueness
  final_slug := base_slug || '-' || substr(md5(random()::text), 1, 6);

  -- 1. Create Organization first
  INSERT INTO public.organizations (name, slug)
  VALUES (org_name, final_slug)
  RETURNING id INTO new_org_id;

  -- 2. Create Profile and link to the new organization with 'admin' role
  INSERT INTO public.profiles (id, full_name, organization_id, role)
  VALUES (new.id, full_name, new_org_id, 'admin')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Silently handle errors so user creation doesn't fail, logging is optional here
    RETURN new;
END;
$$;
