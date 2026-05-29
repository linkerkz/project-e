import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export type SupabaseConnectionResult = {
  ok: boolean;
  message: string;
};

export async function checkSupabaseConnection(): Promise<SupabaseConnectionResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      message:
        "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY. Add them to .env and restart Expo.",
    };
  }

  if (!supabase) {
    return { ok: false, message: "Supabase client could not be created." };
  }

  try {
    const { error } = await supabase
      .from("__connection_check__")
      .select("*")
      .limit(1);

    if (!error) {
      return { ok: true, message: "Connected to Supabase." };
    }

    // A missing table error still proves the URL/key reached Supabase correctly.
    if (error.code === "PGRST205" || error.code === "42P01") {
      return { ok: true, message: "Connected to Supabase REST API." };
    }

    return {
      ok: false,
      message: `Supabase responded: ${error.message}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to reach Supabase.",
    };
  }
}
