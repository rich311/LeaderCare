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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'leader' | 'provider' | 'admin'
          church_name: string | null
          denomination: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'leader' | 'provider' | 'admin'
          church_name?: string | null
          denomination?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'leader' | 'provider' | 'admin'
          church_name?: string | null
          denomination?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string | null
          name: string
          credentials: string | null
          specialties: string[]
          bio: string | null
          phone: string | null
          email: string
          website: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          insurance_accepted: string[]
          accepting_new_clients: boolean
          languages: string[]
          rating: number
          review_count: number
          location_type: 'in-person' | 'virtual' | 'both'
          location_details: string | null
          gloo_scholarship_available: boolean
          service_durations: string[]
          content_resources: boolean
          content_resources_list: string[]
          denominations: string[]
          retreat_facilitated: boolean
          actual_therapists: boolean
          general_relational_support: string[]
          benevolence_request: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          credentials?: string | null
          specialties?: string[]
          bio?: string | null
          phone?: string | null
          email: string
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          insurance_accepted?: string[]
          accepting_new_clients?: boolean
          languages?: string[]
          rating?: number
          review_count?: number
          location_type?: 'in-person' | 'virtual' | 'both'
          location_details?: string | null
          gloo_scholarship_available?: boolean
          service_durations?: string[]
          content_resources?: boolean
          content_resources_list?: string[]
          denominations?: string[]
          retreat_facilitated?: boolean
          actual_therapists?: boolean
          general_relational_support?: string[]
          benevolence_request?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          credentials?: string | null
          specialties?: string[]
          bio?: string | null
          phone?: string | null
          email?: string
          website?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          insurance_accepted?: string[]
          accepting_new_clients?: boolean
          languages?: string[]
          rating?: number
          review_count?: number
          location_type?: 'in-person' | 'virtual' | 'both'
          location_details?: string | null
          gloo_scholarship_available?: boolean
          service_durations?: string[]
          content_resources?: boolean
          content_resources_list?: string[]
          denominations?: string[]
          retreat_facilitated?: boolean
          actual_therapists?: boolean
          general_relational_support?: string[]
          benevolence_request?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      care_plans: {
        Row: {
          id: string
          user_id: string
          assessment_data: Json
          recommendations: Json
          priority_level: 'low' | 'medium' | 'high' | 'urgent'
          status: 'draft' | 'active' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assessment_data: Json
          recommendations: Json
          priority_level?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'draft' | 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assessment_data?: Json
          recommendations?: Json
          priority_level?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'draft' | 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      care_plan_resources: {
        Row: {
          id: string
          care_plan_id: string
          provider_id: string | null
          resource_type: 'provider' | 'activity' | 'resource' | 'other'
          title: string
          description: string | null
          url: string | null
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          care_plan_id: string
          provider_id?: string | null
          resource_type?: 'provider' | 'activity' | 'resource' | 'other'
          title: string
          description?: string | null
          url?: string | null
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          care_plan_id?: string
          provider_id?: string | null
          resource_type?: 'provider' | 'activity' | 'resource' | 'other'
          title?: string
          description?: string | null
          url?: string | null
          completed?: boolean
          created_at?: string
        }
      }
      provider_reviews: {
        Row: {
          id: string
          provider_id: string
          user_id: string
          rating: number
          review_text: string | null
          anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          user_id: string
          rating: number
          review_text?: string | null
          anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          user_id?: string
          rating?: number
          review_text?: string | null
          anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      saved_providers: {
        Row: {
          id: string
          user_id: string
          provider_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider_id?: string
          created_at?: string
        }
      }
    }
  }
}
