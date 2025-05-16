export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          chapter_id: string
          title: string
          description: string | null
          content: Json | null
          order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          title: string
          description?: string | null
          content?: Json | null
          order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          title?: string
          description?: string | null
          content?: Json | null
          order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          lesson_id: string
          title: string
          description: string | null
          type: string
          content: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          description?: string | null
          type: string
          content: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          description?: string | null
          type?: string
          content?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          exercise_id: string
          user_id: string
          content: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exercise_id: string
          user_id: string
          content: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exercise_id?: string
          user_id?: string
          content?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          submission_id: string
          teacher_id: string
          content: string
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          teacher_id: string
          content: string
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          teacher_id?: string
          content?: string
          score?: number | null
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          course_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          user_id?: string
          created_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      uploads: {
        Row: {
          id: string
          filename: string
          storage_path: string
          file_url: string
          file_type: string
          bucket: string
          uploaded_by: string
          lesson_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          storage_path: string
          file_url: string
          file_type: string
          bucket: string
          uploaded_by: string
          lesson_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          storage_path?: string
          file_url?: string
          file_type?: string
          bucket?: string
          uploaded_by?: string
          lesson_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
