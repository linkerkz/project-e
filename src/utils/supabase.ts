import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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

export type SupabaseConnectionResult = {
  ok: boolean;
  message: string;
};

export async function checkSupabaseConnection(): Promise<SupabaseConnectionResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false,
      message:
        "Нет EXPO_PUBLIC_SUPABASE_URL или EXPO_PUBLIC_SUPABASE_KEY. Добавь их в .env и перезапусти Expo.",
    };
  }

  if (!supabase) {
    return { ok: false, message: "Клиент Supabase не создан." };
  }

  try {
    const { error } = await supabase
      .from("__connection_check__")
      .select("*")
      .limit(1);

    if (!error) {
      return { ok: true, message: "Подключено к Supabase." };
    }

    // Ошибка отсутствующей таблицы всё равно значит, что URL и ключ дошли до Supabase.
    if (error.code === "PGRST205" || error.code === "42P01") {
      return { ok: true, message: "Подключено к REST API Supabase." };
    }

    return {
      ok: false,
      message: `Supabase ответил: ${error.message}`,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Не удалось подключиться к Supabase.",
    };
  }
}
