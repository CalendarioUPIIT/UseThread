import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bneeeuhloherxnwiqetg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZWVldWhsb2hlcnhud2lxZXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxNjc3NjMsImV4cCI6MjAzMzc0Mzc2M30.JoAQKRxQZk57JqCeZc_fVjmguzNsxL5Tn5zdTwJjPi8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})