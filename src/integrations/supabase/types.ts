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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string | null
          expiration_date: string | null
          id: string
          priority_level: string | null
          publish_date: string | null
          target_audience: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          priority_level?: string | null
          publish_date?: string | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          priority_level?: string | null
          publish_date?: string | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          categories: string[] | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          publish_date: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          categories?: string[] | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          publish_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          categories?: string[] | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          publish_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      grants: {
        Row: {
          application_link: string | null
          categories: string[] | null
          created_at: string | null
          deadline: string | null
          description: string
          eligibility_criteria: string | null
          funding_amount: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          application_link?: string | null
          categories?: string[] | null
          created_at?: string | null
          deadline?: string | null
          description: string
          eligibility_criteria?: string | null
          funding_amount?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          application_link?: string | null
          categories?: string[] | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          eligibility_criteria?: string | null
          funding_amount?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_opportunities: {
        Row: {
          application_instructions: string | null
          created_at: string | null
          deadline: string | null
          department: string | null
          description: string
          id: string
          location: string | null
          requirements: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          application_instructions?: string | null
          created_at?: string | null
          deadline?: string | null
          department?: string | null
          description: string
          id?: string
          location?: string | null
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          application_instructions?: string | null
          created_at?: string | null
          deadline?: string | null
          department?: string | null
          description?: string
          id?: string
          location?: string | null
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          achievements: string | null
          activities: string | null
          address: string | null
          country: string | null
          created_at: string
          current_challenges: string | null
          id: string
          mission: string | null
          name: string
          registration_number: string | null
          services_required: string[] | null
          target_population: string | null
          updated_at: string
          user_id: string
          website: string | null
          year_established: number | null
        }
        Insert: {
          achievements?: string | null
          activities?: string | null
          address?: string | null
          country?: string | null
          created_at?: string
          current_challenges?: string | null
          id?: string
          mission?: string | null
          name: string
          registration_number?: string | null
          services_required?: string[] | null
          target_population?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          year_established?: number | null
        }
        Update: {
          achievements?: string | null
          activities?: string | null
          address?: string | null
          country?: string | null
          created_at?: string
          current_challenges?: string | null
          id?: string
          mission?: string | null
          name?: string
          registration_number?: string | null
          services_required?: string[] | null
          target_population?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          year_established?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          first_name: string | null
          full_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_descriptions: {
        Row: {
          created_at: string | null
          detailed_description: string | null
          display_order: number | null
          features_list: string[] | null
          icon: string | null
          id: string
          name: string
          related_services: string[] | null
          short_description: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          detailed_description?: string | null
          display_order?: number | null
          features_list?: string[] | null
          icon?: string | null
          id?: string
          name: string
          related_services?: string[] | null
          short_description?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          detailed_description?: string | null
          display_order?: number | null
          features_list?: string[] | null
          icon?: string | null
          id?: string
          name?: string
          related_services?: string[] | null
          short_description?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          category: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          expertise_areas: string[] | null
          id: string
          name: string
          photo_url: string | null
          position: string
          social_links: Json | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          expertise_areas?: string[] | null
          id?: string
          name: string
          photo_url?: string | null
          position: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          expertise_areas?: string[] | null
          id?: string
          name?: string
          photo_url?: string | null
          position?: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "visitor" | "organization" | "consultant" | "admin"
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
    Enums: {
      app_role: ["visitor", "organization", "consultant", "admin"],
    },
  },
} as const
