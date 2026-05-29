import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SITE_PAGES } from "./_layout";
import { checkSupabaseConnection, supabase } from "../src/utils/supabase";

type LinkRow = {
  id: string | number;
  title?: string | null;
  label?: string | null;
  url?: string | null;
  href?: string | null;
  path?: string | null;
};

const linkClassName = "text-base text-blue-600 underline";

export default function HomePage() {
  const [connection, setConnection] = useState("Checking Supabase connection…");
  const [connectionOk, setConnectionOk] = useState(false);
  const [databaseLinks, setDatabaseLinks] = useState<LinkRow[]>([]);
  const [databaseMessage, setDatabaseMessage] = useState("Loading links table…");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const result = await checkSupabaseConnection();
      if (!mounted) return;

      setConnection(result.message);
      setConnectionOk(result.ok);

      if (!supabase) {
        setDatabaseMessage("Supabase client is not configured yet.");
        return;
      }

      const { data, error } = await supabase.from("links").select("*").limit(50);
      if (!mounted) return;

      if (error) {
        setDatabaseMessage(
          `Connected, but could not read a public links table: ${error.message}`,
        );
        return;
      }

      setDatabaseLinks((data ?? []) as LinkRow[]);
      setDatabaseMessage(
        data && data.length > 0
          ? `Loaded ${data.length} link${data.length === 1 ? "" : "s"} from Supabase.`
          : "Connected. Create a public links table to show database rows here.",
      );
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="gap-4 p-5">
        <Text className="text-2xl font-bold text-gray-950">All pages</Text>
        <Text className="text-base leading-6 text-gray-700">
          Every route is linked here and every detail page has a backlink to this page.
        </Text>

        <View className="gap-3 rounded-xl border border-gray-200 bg-white p-4">
          {SITE_PAGES.map((page) => (
            <Link key={page.href} href={page.href} asChild>
              <Text className={linkClassName}>
                {page.label} → {page.href}
              </Text>
            </Link>
          ))}
        </View>

        <Text className="text-2xl font-bold text-gray-950">Supabase status</Text>
        <View className="gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Text
            className={`text-base font-bold ${connectionOk ? "text-emerald-700" : "text-amber-700"}`}
          >
            {connectionOk ? "✓" : "!"} {connection}
          </Text>
          <Text className="text-base leading-6 text-gray-700">{databaseMessage}</Text>
        </View>

        {databaseLinks.length > 0 ? (
          <View className="gap-3 rounded-xl border border-gray-200 bg-white p-4">
            {databaseLinks.map((row) => {
              const href = row.href ?? row.path ?? row.url ?? "/";
              const label = row.title ?? row.label ?? String(href);
              return (
                <Link key={String(row.id)} href={href} asChild>
                  <Text className={linkClassName}>{label}</Text>
                </Link>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
