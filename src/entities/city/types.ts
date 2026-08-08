// Строка справочника городов. name — каноничное имя, которым заполнены
// activities.city / series.city; его отдаёт селект и по нему фильтруется лента.
export type City = {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  sort: number;
};
