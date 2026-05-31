import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase не настроен. Добавь EXPO_PUBLIC_SUPABASE_URL и EXPO_PUBLIC_SUPABASE_KEY.",
    );
  }
  return supabase;
}
