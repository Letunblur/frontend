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
      file_metadata: {
        Row: {
          created_at: string | null
          description: string | null
          expire_at: string | null
          file_id: string
          id: string
          is_private: boolean | null
          original_url: string
          parent_file_id: string | null
          preview_url: string
          price: number
          slug: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expire_at?: string | null
          file_id: string
          id?: string
          is_private?: boolean | null
          original_url: string
          parent_file_id?: string | null
          preview_url: string
          price: number
          slug: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expire_at?: string | null
          file_id?: string
          id?: string
          is_private?: boolean | null
          original_url?: string
          parent_file_id?: string | null
          preview_url?: string
          price?: number
          slug?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          buyer_email: string
          buyer_id: string | null
          created_at: string | null
          file_id: string
          id: string
          payment_status: string
          seller_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          buyer_email: string
          buyer_id?: string | null
          created_at?: string | null
          file_id: string
          id?: string
          payment_status?: string
          seller_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          buyer_email?: string
          buyer_id?: string | null
          created_at?: string | null
          file_id?: string
          id?: string
          payment_status?: string
          seller_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          reason: string
          reported_link: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          reason?: string
          reported_link?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          reason?: string
          reported_link?: string
        }
        Relationships: []
      }
      support_ticket_counters: {
        Row: {
          counter: number
          created_at: string | null
          date: string
          id: string
        }
        Insert: {
          counter?: number
          created_at?: string | null
          date: string
          id?: string
        }
        Update: {
          counter?: number
          created_at?: string | null
          date?: string
          id?: string
        }
        Relationships: []
      }
      user_email_archive: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          account_name: string | null
          auto_expire: boolean | null
          bic: string | null
          bio: string | null
          created_at: string | null
          crypto_type: string | null
          default_price: string | null
          email: string
          first_name: string | null
          iban: string | null
          id: string
          last_name: string | null
          marketing_emails: boolean | null
          paypal_email: string | null
          phone: string | null
          updated_at: string | null
          username: string | null
          wallet_address: string | null
          watermark: boolean | null
        }
        Insert: {
          account_name?: string | null
          auto_expire?: boolean | null
          bic?: string | null
          bio?: string | null
          created_at?: string | null
          crypto_type?: string | null
          default_price?: string | null
          email: string
          first_name?: string | null
          iban?: string | null
          id: string
          last_name?: string | null
          marketing_emails?: boolean | null
          paypal_email?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string | null
          watermark?: boolean | null
        }
        Update: {
          account_name?: string | null
          auto_expire?: boolean | null
          bic?: string | null
          bio?: string | null
          created_at?: string | null
          crypto_type?: string | null
          default_price?: string | null
          email?: string
          first_name?: string | null
          iban?: string | null
          id?: string
          last_name?: string | null
          marketing_emails?: boolean | null
          paypal_email?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string | null
          watermark?: boolean | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
