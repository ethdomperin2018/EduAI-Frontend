// Common interfaces for the application

// User related interfaces
export interface User {
  id: string
  email: string
  full_name: string
  role: "student" | "teacher" | "admin"
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Course related interfaces
export interface Course {
  id: string
  title: string
  description?: string
  is_published: boolean
  created_by?: string
  created_at: string
  updated_at: string
  chapters?: Chapter[]
}

export interface Chapter {
  id: string
  course_id: string
  title: string
  description?: string
  order: number
  created_by?: string
  created_at: string
  updated_at: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  chapter_id: string
  title: string
  description?: string
  content?: LessonContent
  order: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface LessonContent {
  video_url?: string
  text_content?: string
  attachments?: string[]
  [key: string]: any
}

// Exercise related interfaces
export interface Exercise {
  id: string
  lesson_id: string
  title: string
  description?: string
  type: "quiz" | "fill-in-blanks" | "matching" | string
  content: QuizContent | FillInBlanksContent | MatchingContent
  created_by?: string
  created_at: string
  updated_at: string
}

export interface QuizContent {
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  text: string
  options: string[]
  correct: number
  explanation?: string
}

export interface FillInBlanksContent {
  text: string
  blanks: Blank[]
}

export interface Blank {
  answer: string
  hint?: string
}

export interface MatchingContent {
  pairs: MatchingPair[]
}

export interface MatchingPair {
  left: string
  right: string
  index: number
}

export interface Submission {
  id: string
  exercise_id: string
  user_id: string
  content: any
  status: "submitted" | "graded"
  created_at: string
  updated_at: string
}

// Progress related interfaces
export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  status: "not_started" | "in_progress" | "completed"
  completed_at?: string
  created_at: string
  updated_at: string
}

// Upload related interfaces
export interface Upload {
  id: string
  filename: string
  storage_path: string
  file_url: string
  file_type: string
  bucket: string
  uploaded_by: string
  lesson_id?: string
  created_at: string
}

// Avatar related interfaces
export type AvatarState =
  | "idle"
  | "listening"
  | "helping"
  | "success"
  | "encouragement"
  | "good"
  | "completion"
  | "document"

// Annotation related interfaces
export type AnnotationTool = "text" | "highlight" | "circle" | "underline" | "clear" | null

export interface Annotation {
  type: AnnotationTool
  x: number
  y: number
  width?: number
  height?: number
  text?: string
}
