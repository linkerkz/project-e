// Device-local запись о запланированном напоминании: связь публичной ссылки
// активности с id уведомления в системе. Серверного владения нет.
export type Reminder = {
  slug: string;
  notificationId: string;
  startsAt: string;
};

// Device-local настройка напоминаний: выключатель и смещение до старта.
// Уже запланированные напоминания при смене не пересчитываем (MVP-упрощение).
export type ReminderSettings = {
  enabled: boolean;
  offsetHours: number;
};
