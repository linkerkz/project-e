import { useEffect, useState } from "react";
import { readLikedSlugs, toggleLike } from "../../entities/activity/local";

// Device-local лайк активности по slug. Серверной агрегации нет — храним только
// состояние «лайкнуто/нет» на устройстве (по образцу useRespondedFlag).
export function useLikeActivity(slug?: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (slug == null) return;
    let active = true;
    readLikedSlugs()
      .then((slugs) => {
        if (active) setIsLiked(slugs.includes(slug));
      })
      // Лайк не критичен: ошибка чтения = считаем, что лайка не было.
      .catch(() => {
        if (active) setIsLiked(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  async function toggle() {
    if (slug == null || isToggling) return;
    setIsToggling(true);
    setIsLiked((liked) => !liked);
    try {
      await toggleLike(slug);
    } catch {
      // Запись не удалась — откатываем оптимистичное состояние к хранилищу.
      setIsLiked((liked) => !liked);
    } finally {
      setIsToggling(false);
    }
  }

  return { isLiked, toggle, isToggling };
}
