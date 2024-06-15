import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.EXPO_PUBLIC_API_SB || ""

const supabaseAnonKey = process.env.EXPO_PUBLIC_API_ANON || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})