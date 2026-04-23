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
  provided_role text;
BEGIN
  full_name := new.raw_user_meta_data->>'full_name';
  
  -- Handle uuid conversion safely
  BEGIN
    provided_org_id := (new.raw_user_meta_data->>'organization_id')::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    provided_org_id := NULL;
  END;

  provided_role := new.raw_user_meta_data->>'role';

  IF provided_org_id IS NOT NULL THEN
    -- Joining existing org as a student (or specified role)
    INSERT INTO public.profiles (id, full_name, organization_id, role)
    VALUES (new.id, full_name, provided_org_id, COALESCE(provided_role, 'student'))
    ON CONFLICT (id) DO NOTHING;
  ELSE
    -- Creating new org as admin
    org_name := COALESCE(new.raw_user_meta_data->>'org_name', 'My Organization');
    
    base_slug := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    
    IF base_slug = '' OR base_slug IS NULL THEN
      base_slug := 'org';
    END IF;
  
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
