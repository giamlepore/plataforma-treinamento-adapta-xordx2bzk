// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration_text: string | null
          id: string
          image_color: string | null
          image_query: string | null
          instructor_avatar: string | null
          instructor_name: string | null
          label: string | null
          organization_id: string
          rating: number | null
          reviews: number | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_text?: string | null
          id?: string
          image_color?: string | null
          image_query?: string | null
          instructor_avatar?: string | null
          instructor_name?: string | null
          label?: string | null
          organization_id: string
          rating?: number | null
          reviews?: number | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_text?: string | null
          id?: string
          image_color?: string | null
          image_query?: string | null
          instructor_avatar?: string | null
          instructor_name?: string | null
          label?: string | null
          organization_id?: string
          rating?: number | null
          reviews?: number | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          duration: string | null
          id: string
          is_locked: boolean | null
          is_test: boolean | null
          module_id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          duration?: string | null
          id?: string
          is_locked?: boolean | null
          is_test?: boolean | null
          module_id: string
          order_index?: number
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          duration?: string | null
          id?: string
          is_locked?: boolean | null
          is_test?: boolean | null
          module_id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order_index?: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          header_subtitle: string | null
          header_subtitle_color: string | null
          header_title: string | null
          header_title_color: string | null
          hero_subtitle: string | null
          hero_subtitle_color: string | null
          hero_title: string | null
          hero_title_color: string | null
          id: string
          logo_url: string | null
          name: string
          platform_bg_color: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          header_subtitle?: string | null
          header_subtitle_color?: string | null
          header_title?: string | null
          header_title_color?: string | null
          hero_subtitle?: string | null
          hero_subtitle_color?: string | null
          hero_title?: string | null
          hero_title_color?: string | null
          id?: string
          logo_url?: string | null
          name: string
          platform_bg_color?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          header_subtitle?: string | null
          header_subtitle_color?: string | null
          header_title?: string | null
          header_title_color?: string | null
          hero_subtitle?: string | null
          hero_subtitle_color?: string | null
          hero_title?: string | null
          hero_title_color?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          platform_bg_color?: string | null
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_text: string
          order_index: number
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text: string
          order_index?: number
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          order_index: number
          question_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          order_index?: number
          question_text: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          order_index?: number
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          id: string
          is_completed: boolean | null
          last_watched_at: string | null
          lesson_id: string
          profile_id: string
          score: number | null
        }
        Insert: {
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          lesson_id: string
          profile_id: string
          score?: number | null
        }
        Update: {
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          lesson_id?: string
          profile_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: courses
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   title: text (not null)
//   description: text (nullable)
//   instructor_name: text (nullable)
//   instructor_avatar: text (nullable)
//   duration_text: text (nullable)
//   image_color: text (nullable)
//   image_query: text (nullable)
//   label: text (nullable)
//   rating: numeric (nullable)
//   reviews: integer (nullable, default: 0)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
//   thumbnail_url: text (nullable)
// Table: lessons
//   id: uuid (not null, default: gen_random_uuid())
//   module_id: uuid (not null)
//   title: text (not null)
//   duration: text (nullable)
//   video_url: text (nullable)
//   is_test: boolean (nullable, default: false)
//   is_locked: boolean (nullable, default: false)
//   order_index: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: modules
//   id: uuid (not null, default: gen_random_uuid())
//   course_id: uuid (not null)
//   title: text (not null)
//   order_index: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: organizations
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   slug: text (not null)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
//   header_title: text (nullable, default: 'BETSMARTER'::text)
//   header_subtitle: text (nullable, default: 'Course Dashboard'::text)
//   hero_title: text (nullable, default: 'Advance Your Betting Knowledge'::text)
//   hero_subtitle: text (nullable, default: 'Access professional-grade courses and validated strategies. Master the mathematics, psychology, and systems of profitable betting.'::text)
//   platform_bg_color: text (nullable, default: '#1a5c48'::text)
//   logo_url: text (nullable)
//   header_title_color: text (nullable)
//   header_subtitle_color: text (nullable)
//   hero_title_color: text (nullable)
//   hero_subtitle_color: text (nullable)
// Table: profiles
//   id: uuid (not null)
//   organization_id: uuid (nullable)
//   full_name: text (nullable)
//   avatar_url: text (nullable)
//   role: text (nullable, default: 'student'::text)
//   created_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
//   updated_at: timestamp with time zone (not null, default: timezone('utc'::text, now()))
// Table: quiz_options
//   id: uuid (not null, default: gen_random_uuid())
//   question_id: uuid (not null)
//   option_text: text (not null)
//   is_correct: boolean (not null, default: false)
//   order_index: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: quiz_questions
//   id: uuid (not null, default: gen_random_uuid())
//   lesson_id: uuid (not null)
//   question_text: text (not null)
//   order_index: integer (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: user_progress
//   id: uuid (not null, default: gen_random_uuid())
//   profile_id: uuid (not null)
//   lesson_id: uuid (not null)
//   is_completed: boolean (nullable, default: false)
//   last_watched_at: timestamp with time zone (nullable, default: timezone('utc'::text, now()))
//   score: numeric (nullable)

// --- CONSTRAINTS ---
// Table: courses
//   FOREIGN KEY courses_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY courses_pkey: PRIMARY KEY (id)
// Table: lessons
//   FOREIGN KEY lessons_module_id_fkey: FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
//   PRIMARY KEY lessons_pkey: PRIMARY KEY (id)
// Table: modules
//   FOREIGN KEY modules_course_id_fkey: FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
//   PRIMARY KEY modules_pkey: PRIMARY KEY (id)
// Table: organizations
//   PRIMARY KEY organizations_pkey: PRIMARY KEY (id)
//   UNIQUE organizations_slug_key: UNIQUE (slug)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id)
//   FOREIGN KEY profiles_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id)
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: quiz_options
//   PRIMARY KEY quiz_options_pkey: PRIMARY KEY (id)
//   FOREIGN KEY quiz_options_question_id_fkey: FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
// Table: quiz_questions
//   FOREIGN KEY quiz_questions_lesson_id_fkey: FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
//   PRIMARY KEY quiz_questions_pkey: PRIMARY KEY (id)
// Table: user_progress
//   FOREIGN KEY user_progress_lesson_id_fkey: FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
//   PRIMARY KEY user_progress_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_progress_profile_id_fkey: FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE user_progress_profile_id_lesson_id_key: UNIQUE (profile_id, lesson_id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: courses
//   Policy "Admins can delete courses" (DELETE, PERMISSIVE) roles={public}
//     USING: (organization_id IN ( SELECT profiles.organization_id    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Admins can insert courses" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id IN ( SELECT profiles.organization_id    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Admins can update courses" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id IN ( SELECT profiles.organization_id    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can read courses of their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id IN ( SELECT profiles.organization_id    FROM profiles   WHERE (profiles.id = auth.uid())))
// Table: lessons
//   Policy "Admins can all lessons" (ALL, PERMISSIVE) roles={public}
//     USING: (module_id IN ( SELECT m.id    FROM ((modules m      JOIN courses c ON ((c.id = m.course_id)))      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))
//   Policy "Users can read lessons of their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (module_id IN ( SELECT m.id    FROM ((modules m      JOIN courses c ON ((c.id = m.course_id)))      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE (p.id = auth.uid())))
// Table: modules
//   Policy "Admins can all modules" (ALL, PERMISSIVE) roles={public}
//     USING: (course_id IN ( SELECT c.id    FROM (courses c      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))
//   Policy "Users can read modules of their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (course_id IN ( SELECT c.id    FROM (courses c      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE (p.id = auth.uid())))
// Table: organizations
//   Policy "Admins can update their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (id IN ( SELECT profiles.organization_id    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Allow public read access" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "Users can read organization they belong to" (SELECT, PERMISSIVE) roles={public}
//     USING: (id IN ( SELECT profiles.organization_id    FROM profiles   WHERE (profiles.id = auth.uid())))
// Table: profiles
//   Policy "Users can read their own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
//   Policy "Users can update their own profile" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
// Table: quiz_options
//   Policy "Admins can manage quiz_options" (ALL, PERMISSIVE) roles={public}
//     USING: (question_id IN ( SELECT q.id    FROM ((((quiz_questions q      JOIN lessons l ON ((l.id = q.lesson_id)))      JOIN modules m ON ((m.id = l.module_id)))      JOIN courses c ON ((c.id = m.course_id)))      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))
//   Policy "Users can read quiz_options" (SELECT, PERMISSIVE) roles={public}
//     USING: (question_id IN ( SELECT q.id    FROM ((((quiz_questions q      JOIN lessons l ON ((l.id = q.lesson_id)))      JOIN modules m ON ((m.id = l.module_id)))      JOIN courses c ON ((c.id = m.course_id)))      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE (p.id = auth.uid())))
// Table: quiz_questions
//   Policy "Admins can manage quiz_questions" (ALL, PERMISSIVE) roles={public}
//     USING: (lesson_id IN ( SELECT l.id    FROM (((lessons l      JOIN modules m ON ((m.id = l.module_id)))      JOIN courses c ON ((c.id = m.course_id)))      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))
//   Policy "Users can read quiz_questions" (SELECT, PERMISSIVE) roles={public}
//     USING: (lesson_id IN ( SELECT l.id    FROM (((lessons l      JOIN modules m ON ((m.id = l.module_id)))      JOIN courses c ON ((c.id = m.course_id)))      JOIN profiles p ON ((p.organization_id = c.organization_id)))   WHERE (p.id = auth.uid())))
// Table: user_progress
//   Policy "Users can insert/update their own progress" (ALL, PERMISSIVE) roles={public}
//     USING: (profile_id = auth.uid())
//   Policy "Users can read their own progress" (SELECT, PERMISSIVE) roles={public}
//     USING: (profile_id = auth.uid())

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     new_org_id uuid;
//     org_name text;
//     base_slug text;
//     final_slug text;
//     full_name text;
//     provided_org_id uuid;
//   BEGIN
//     full_name := new.raw_user_meta_data->>'full_name';
//     
//     -- Check for organization_id in metadata
//     -- Safely cast if needed, though usually it's string in JSON
//     BEGIN
//       provided_org_id := (new.raw_user_meta_data->>'organization_id')::uuid;
//     EXCEPTION WHEN OTHERS THEN
//       provided_org_id := NULL;
//     END;
//   
//     IF provided_org_id IS NOT NULL THEN
//        -- User is joining an existing organization
//        INSERT INTO public.profiles (id, full_name, organization_id, role)
//        VALUES (new.id, full_name, provided_org_id, 'student')
//        ON CONFLICT (id) DO NOTHING;
//     ELSE
//        -- User is creating a new organization
//        org_name := COALESCE(new.raw_user_meta_data->>'org_name', 'My Organization');
//        
//        -- Generate a URL-friendly slug from the organization name
//        base_slug := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g');
//        base_slug := trim(both '-' from base_slug);
//        
//        -- Ensure base_slug is not empty
//        IF base_slug = '' OR base_slug IS NULL THEN
//          base_slug := 'org';
//        END IF;
//      
//        -- Append a random string to guarantee uniqueness
//        final_slug := base_slug || '-' || substr(md5(random()::text), 1, 6);
//      
//        INSERT INTO public.organizations (name, slug)
//        VALUES (org_name, final_slug)
//        RETURNING id INTO new_org_id;
//      
//        INSERT INTO public.profiles (id, full_name, organization_id, role)
//        VALUES (new.id, full_name, new_org_id, 'admin')
//        ON CONFLICT (id) DO NOTHING;
//     END IF;
//   
//     RETURN new;
//   EXCEPTION
//     WHEN others THEN
//       -- Silently handle errors so user creation doesn't fail
//       RETURN new;
//   END;
//   $function$
//   

// --- INDEXES ---
// Table: organizations
//   CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug)
// Table: user_progress
//   CREATE UNIQUE INDEX user_progress_profile_id_lesson_id_key ON public.user_progress USING btree (profile_id, lesson_id)

