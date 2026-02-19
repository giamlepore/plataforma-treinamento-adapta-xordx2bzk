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
          header_title: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          logo_url: string | null
          name: string
          platform_bg_color: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          header_subtitle?: string | null
          header_title?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          logo_url?: string | null
          name: string
          platform_bg_color?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          header_subtitle?: string | null
          header_title?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
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
      user_progress: {
        Row: {
          id: string
          is_completed: boolean | null
          last_watched_at: string | null
          lesson_id: string
          profile_id: string
        }
        Insert: {
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          lesson_id: string
          profile_id: string
        }
        Update: {
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          lesson_id?: string
          profile_id?: string
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
// This section contains constraints, RLS policies, functions, triggers,
// indexes and materialized views not present in the type definitions above.

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
// Table: user_progress
//   FOREIGN KEY user_progress_lesson_id_fkey: FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
//   PRIMARY KEY user_progress_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_progress_profile_id_fkey: FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
//   UNIQUE user_progress_profile_id_lesson_id_key: UNIQUE (profile_id, lesson_id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: courses
//   Policy "Admins can delete courses" (DELETE, PERMISSIVE) roles={public}
//     USING: (organization_id IN ( SELECT profiles.organization_id
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Admins can insert courses" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id IN ( SELECT profiles.organization_id
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Admins can update courses" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id IN ( SELECT profiles.organization_id
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can read courses of their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id IN ( SELECT profiles.organization_id
   FROM profiles
  WHERE (profiles.id = auth.uid())))
// Table: lessons
//   Policy "Admins can all lessons" (ALL, PERMISSIVE) roles={public}
//     USING: (module_id IN ( SELECT m.id
   FROM ((modules m
     JOIN courses c ON ((c.id = m.course_id)))
     JOIN profiles p ON ((p.organization_id = c.organization_id)))
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))
//   Policy "Users can read lessons of their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (module_id IN ( SELECT m.id
   FROM ((modules m
     JOIN courses c ON ((c.id = m.course_id)))
     JOIN profiles p ON ((p.organization_id = c.organization_id)))
  WHERE (p.id = auth.uid())))
// Table: modules
//   Policy "Admins can all modules" (ALL, PERMISSIVE) roles={public}
//     USING: (course_id IN ( SELECT c.id
   FROM (courses c
     JOIN profiles p ON ((p.organization_id = c.organization_id)))
  WHERE ((p.id = auth.uid()) AND (p.role = 'admin'::text))))
//   Policy "Users can read modules of their organization" (SELECT, PERMISSIVE) roles={public}
//     USING: (course_id IN ( SELECT c.id
   FROM (courses c
     JOIN profiles p ON ((p.organization_id = c.organization_id)))
  WHERE (p.id = auth.uid())))
// Table: organizations
//   Policy "Admins can update their organization" (UPDATE, PERMISSIVE) roles={public}
//     USING: (id IN ( SELECT profiles.organization_id
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//   Policy "Users can read organization they belong to" (SELECT, PERMISSIVE) roles={public}
//     USING: (id IN ( SELECT profiles.organization_id
   FROM profiles
  WHERE (profiles.id = auth.uid())))
// Table: profiles
//   Policy "Users can read their own profile" (SELECT, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
//   Policy "Users can update their own profile" (UPDATE, PERMISSIVE) roles={public}
//     USING: (auth.uid() = id)
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
//   BEGIN
//     -- Extract organization name from metadata, fallback if not provided
//     org_name := COALESCE(new.raw_user_meta_data->>'org_name', 'My Organization');
//   
//     -- 1. Create Profile if table exists
//     IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
//       INSERT INTO public.profiles (id, full_name)
//       VALUES (new.id, new.raw_user_meta_data->>'full_name')
//       ON CONFLICT (id) DO NOTHING;
//     END IF;
//   
//     -- 2. Create Organization if table exists
//     IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organizations') THEN
//       INSERT INTO public.organizations (name)
//       VALUES (org_name)
//       RETURNING id INTO new_org_id;
//   
//       -- 3. Link user to organization as owner if members table exists
//       IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organization_members') THEN
//         INSERT INTO public.organization_members (organization_id, user_id, role)
//         VALUES (new_org_id, new.id, 'owner');
//       END IF;
//     END IF;
//   
//     RETURN new;
//   EXCEPTION
//     WHEN others THEN
//       -- Silently handle errors so user creation doesn't fail, logging is optional here
//       RETURN new;
//   END;
//   $function$
//   

// --- INDEXES ---
// Table: organizations
//   CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug)
// Table: user_progress
//   CREATE UNIQUE INDEX user_progress_profile_id_lesson_id_key ON public.user_progress USING btree (profile_id, lesson_id)

