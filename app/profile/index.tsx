import { Linking, Text, View } from "react-native";
import { useMyActivities } from "../../src/entities/activity/hooks";
import type { MyActivity } from "../../src/entities/activity/local";
import { useMyResponses } from "../../src/entities/participant/hooks";
import { useProfile, useResetProfile } from "../../src/entities/profile/hooks";
import type { Profile } from "../../src/entities/profile/types";
import {
  formatRegisteredAt,
  getFilledSocials,
} from "../../src/entities/profile/utils";
import {
  useReminderSettings,
  useSaveReminderSettings,
} from "../../src/entities/reminder/hooks";
import { defaultReminderSettings } from "../../src/entities/reminder/settings";
import { hoursWord, offsetOptions } from "../../src/entities/reminder/utils";
import { useMyMemberships, useMySeries } from "../../src/entities/series/hooks";
import type { Membership, MySeries } from "../../src/entities/series/local";
import { Avatar } from "../../src/shared/ui/Avatar";
import { BackLink } from "../../src/shared/ui/BackLink";
import { Button } from "../../src/shared/ui/Button";
import { LoadingPage } from "../../src/shared/ui/LoadingPage";
import { Page } from "../../src/shared/ui/Page";
import { TextLink } from "../../src/shared/ui/TextLink";

export default function ProfilePage() {
  const profileQuery = useProfile();
  const myActivities = useMyActivities();
  const myResponses = useMyResponses();
  const mySeries = useMySeries();
  const myMemberships = useMyMemberships();
  const reset = useResetProfile();

  if (profileQuery.isLoading) return <LoadingPage />;
  const profile = profileQuery.data;
  if (!profile) return <EmptyProfile />;

  return (
    <Page>
      <BackLink />
      <ProfileHeader profile={profile} />
      <Stats
        created={myActivities.data?.length ?? 0}
        visited={myResponses.data?.length ?? 0}
      />
      <Socials profile={profile} />
      <ReminderSettings />
      <MyActivities items={myActivities.data ?? []} />
      <MySeriesList items={mySeries.data ?? []} />
      <AttendedSeries items={myMemberships.data ?? []} />
      <TextLink href="/profile/edit">[Редактировать профиль]</TextLink>
      <Button title="Выйти" onPress={() => reset.mutate()} />
    </Page>
  );
}

function EmptyProfile() {
  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Профиль</Text>
      <Text>Профиль ещё не создан на этом устройстве.</Text>
      <TextLink href="/profile/edit">[Создать профиль]</TextLink>
    </Page>
  );
}

function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <View className="gap-2">
      <Avatar photoUrl={profile.photoUrl} name={profile.fullName} />
      <Text className="text-3xl font-bold">{profile.fullName}</Text>
      {profile.city != null ? <Text>{profile.city}</Text> : null}
      {profile.categories.length > 0 ? (
        <Text>Интересы: {profile.categories.join(", ")}</Text>
      ) : null}
      <Text>На Venty с {formatRegisteredAt(profile.registeredAt)}</Text>
    </View>
  );
}

function Stats({ created, visited }: { created: number; visited: number }) {
  return (
    <View className="gap-1 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Статистика</Text>
      <Text>Создано: {created}</Text>
      <Text>Посещено: {visited}</Text>
      <Text>Друзья: — (появится после авторизации)</Text>
    </View>
  );
}

function Socials({ profile }: { profile: Profile }) {
  const filled = getFilledSocials(profile.socials);
  if (filled.length === 0) return null;

  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Соцсети</Text>
      {filled.map((social) => (
        <Button
          key={social.key}
          title={`${social.label}: ${social.url}`}
          onPress={() => openExternal(social.url)}
        />
      ))}
    </View>
  );
}

function ReminderSettings() {
  const settingsQuery = useReminderSettings();
  const save = useSaveReminderSettings();
  const settings = settingsQuery.data ?? defaultReminderSettings;

  const toggle = () => save.mutate({ ...settings, enabled: !settings.enabled });
  const pickOffset = (offsetHours: number) =>
    save.mutate({ enabled: true, offsetHours });

  return (
    <View className="gap-2 border border-gray-400 p-3">
      <Text className="text-xl font-bold">Напоминания</Text>
      <Button
        title={`${settings.enabled ? "[x]" : "[ ]"} Напоминать о начале ивента`}
        onPress={toggle}
      />
      {settings.enabled ? (
        <View className="gap-2">
          <Text>За сколько предупредить:</Text>
          <View className="flex-row flex-wrap gap-2">
            {offsetOptions.map((hours) => (
              <Button
                key={hours}
                title={`${settings.offsetHours === hours ? "[x]" : "[ ]"} ${hours} ${hoursWord(hours)}`}
                onPress={() => pickOffset(hours)}
              />
            ))}
          </View>
          <Text className="text-gray-500">
            Уже запланированные напоминания сохранят прежнее время.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function MyActivities({ items }: { items: MyActivity[] }) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Мои ивенты</Text>
      {items.length === 0 ? <Text>Пока ничего не создано.</Text> : null}
      {items.map((item) => (
        <View key={item.slug} className="border-b border-gray-300 py-2">
          <Text>
            {item.title} — {item.city}
          </Text>
          <View className="flex-row gap-4">
            <TextLink href={`/a/${item.slug}`}>страница</TextLink>
            <TextLink href={`/manage/${item.editToken}`}>управление</TextLink>
          </View>
        </View>
      ))}
    </View>
  );
}

function MySeriesList({ items }: { items: MySeries[] }) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Мои серии</Text>
      {items.length === 0 ? <Text>Пока ничего не создано.</Text> : null}
      {items.map((item) => (
        <View key={item.slug} className="border-b border-gray-300 py-2">
          <Text>
            {item.title} — {item.city}
          </Text>
          <View className="flex-row gap-4">
            <TextLink href={`/s/${item.slug}`}>страница</TextLink>
            <TextLink href={`/manage/series/${item.editToken}`}>
              управление
            </TextLink>
          </View>
        </View>
      ))}
    </View>
  );
}

function AttendedSeries({ items }: { items: Membership[] }) {
  return (
    <View className="gap-2">
      <Text className="text-xl font-bold">Хожу постоянно</Text>
      {items.length === 0 ? <Text>Пока никуда не записан.</Text> : null}
      {items.map((item) => (
        <View key={item.seriesSlug} className="border-b border-gray-300 py-2">
          <TextLink href={`/s/${item.seriesSlug}`}>{item.seriesSlug}</TextLink>
        </View>
      ))}
    </View>
  );
}

function openExternal(url: string) {
  Linking.openURL(url).catch(() => {});
}
