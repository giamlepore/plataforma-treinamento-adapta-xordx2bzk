export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration_text: string | null
          id: string
          image_color: string | null
          instructor_name: string | null
          label: string | null
          organization_id: string
          rating: number | null
          thumbnail_url: string | null
          title: string
          [key: string]: any
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_text?: string | null
          id?: string
          image_color?: string | null
          instructor_name?: string | null
          label?: string | null
          organization_id: string
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          [key: string]: any
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_text?: string | null
          id?: string
          image_color?: string | null
          instructor_name?: string | null
          label?: string | null
          organization_id?: string
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: 'courses_organization_id_fkey'
            columns: ['organization_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          id: string
          module_id: string
          title: string
          [key: string]: any
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          title: string
          [key: string]: any
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          title?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: 'lessons_module_id_fkey'
            columns: ['module_id']
            referencedRelation: 'modules'
            referencedColumns: ['id']
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          course_id: string
          id: string
          title: string
          [key: string]: any
        }
        Insert: {
          created_at?: string
          course_id: string
          id?: string
          title: string
          [key: string]: any
        }
        Update: {
          created_at?: string
          course_id?: string
          id?: string
          title?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: 'modules_course_id_fkey'
            columns: ['course_id']
            referencedRelation: 'courses'
            referencedColumns: ['id']
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
          [key: string]: any
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
          [key: string]: any
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
          [key: string]: any
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          organization_id: string | null
          role: string | null
          [key: string]: any
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          organization_id?: string | null
          role?: string | null
          [key: string]: any
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          organization_id?: string | null
          role?: string | null
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey'
            columns: ['organization_id']
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          lesson_id: string
          user_id: string
          [key: string]: any
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lesson_id: string
          user_id: string
          [key: string]: any
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lesson_id?: string
          user_id?: string
          [key: string]: any
        }
        Relationships: [
          {
            foreignKeyName: 'user_progress_lesson_id_fkey'
            columns: ['lesson_id']
            referencedRelation: 'lessons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_progress_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
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
