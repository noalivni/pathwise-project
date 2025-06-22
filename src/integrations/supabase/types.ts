export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      interview_sessions: {
        Row: {
          completed_at: string | null
          feedback: string | null
          id: string
          job_role: string | null
          questions: Json | null
          responses: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          feedback?: string | null
          id?: string
          job_role?: string | null
          questions?: Json | null
          responses?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          feedback?: string | null
          id?: string
          job_role?: string | null
          questions?: Json | null
          responses?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      job_roles: {
        Row: {
          ID_num: number
          Industry: string | null
          job_title: string | null
          Pay_grade: string | null
          Short_description: string | null
          Skills_required: string | null
        }
        Insert: {
          ID_num: number
          Industry?: string | null
          job_title?: string | null
          Pay_grade?: string | null
          Short_description?: string | null
          Skills_required?: string | null
        }
        Update: {
          ID_num?: number
          Industry?: string | null
          job_title?: string | null
          Pay_grade?: string | null
          Short_description?: string | null
          Skills_required?: string | null
        }
        Relationships: []
      }
      learning_resources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          related_job_roles: string[] | null
          related_skills: string[] | null
          resource_type: string | null
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          related_job_roles?: string[] | null
          related_skills?: string[] | null
          resource_type?: string | null
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          related_job_roles?: string[] | null
          related_skills?: string[] | null
          resource_type?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          career_history: string | null
          created_at: string | null
          degree_certification: string | null
          email: string | null
          field_of_interest: string | null
          fields_of_study: string | null
          full_name: string | null
          graduation_year: string | null
          hard_skills: string[] | null
          id: string
          location: string | null
          onboarding_completed: boolean | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          career_history?: string | null
          created_at?: string | null
          degree_certification?: string | null
          email?: string | null
          field_of_interest?: string | null
          fields_of_study?: string | null
          full_name?: string | null
          graduation_year?: string | null
          hard_skills?: string[] | null
          id: string
          location?: string | null
          onboarding_completed?: boolean | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          career_history?: string | null
          created_at?: string | null
          degree_certification?: string | null
          email?: string | null
          field_of_interest?: string | null
          fields_of_study?: string | null
          full_name?: string | null
          graduation_year?: string | null
          hard_skills?: string[] | null
          id?: string
          location?: string | null
          onboarding_completed?: boolean | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills_assessments: {
        Row: {
          assessment_type: string | null
          completed_at: string | null
          field_specific_skills: Json | null
          id: string
          personality_traits: Json | null
          recommended_paths: string[] | null
          soft_skills: Json | null
          strengths: string[] | null
          technical_skills: Json | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          assessment_type?: string | null
          completed_at?: string | null
          field_specific_skills?: Json | null
          id?: string
          personality_traits?: Json | null
          recommended_paths?: string[] | null
          soft_skills?: Json | null
          strengths?: string[] | null
          technical_skills?: Json | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          assessment_type?: string | null
          completed_at?: string | null
          field_specific_skills?: Json | null
          id?: string
          personality_traits?: Json | null
          recommended_paths?: string[] | null
          soft_skills?: Json | null
          strengths?: string[] | null
          technical_skills?: Json | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_description: string
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_description: string
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_description?: string
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_job_matches: {
        Row: {
          id: string
          is_bookmarked: boolean | null
          job_role_id: number
          match_percentage: number | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          is_bookmarked?: boolean | null
          job_role_id: number
          match_percentage?: number | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          is_bookmarked?: boolean | null
          job_role_id?: number
          match_percentage?: number | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_job_matches_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["ID_num"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
