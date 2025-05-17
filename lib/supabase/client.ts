// utils/supabase/client.js
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://sbiorlvgotonmveplvpr.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaW9ybHZnb3Rvbm12ZXBsdnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTU5NzksImV4cCI6MjA2Mjc3MTk3OX0.oiptMTmOdrCCpLP-fifdP7yYrdhZteOYoaHMUMi6BR8"
  )
}
