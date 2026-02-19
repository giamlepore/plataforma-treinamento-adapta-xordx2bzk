-- Safely create a trigger function to handle organization and profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_org_id uuid;
  org_name text;
BEGIN
  -- Extract organization name from metadata, fallback if not provided
  org_name := COALESCE(new.raw_user_meta_data->>'org_name', 'My Organization');

  -- 1. Create Profile if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- 2. Create Organization if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organizations') THEN
    INSERT INTO public.organizations (name)
    VALUES (org_name)
    RETURNING id INTO new_org_id;

    -- 3. Link user to organization as owner if members table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organization_members') THEN
      INSERT INTO public.organization_members (organization_id, user_id, role)
      VALUES (new_org_id, new.id, 'owner');
    END IF;
  END IF;

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Silently handle errors so user creation doesn't fail, logging is optional here
    RETURN new;
END;
$$;

-- Safely create the trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;
