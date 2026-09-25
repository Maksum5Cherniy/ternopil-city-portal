import type { HomeCard } from "@/types";

export type PortalEntity = HomeCard & {
  slug: string;
  category: string;
  content: string;
  address?: string;
  price?: string;
  rating?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  date?: string;
  endDate?: string;
  status?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  phone?: string;
  telegram?: string;
  instagram?: string;
  condition?: string;
  contactPreference?: string;
};

export const newsCategories = [
  { slug: "misto", title: "Місто" },
  { slug: "podii", title: "Події" },
  { slug: "transport", title: "Транспорт" },
  { slug: "biznes", title: "Бізнес" },
  { slug: "lokatsii", title: "Локації" },
];

export const placeCategories = [
  { slug: "restaurants", title: "Ресторани" },
  { slug: "kaviarni", title: "Кав'ярні" },
  { slug: "sport", title: "Спорт" },
  { slug: "shops", title: "Магазини" },
  { slug: "services", title: "Послуги" },
];

export const locationCategories = [
  { slug: "parks", title: "Парки" },
  { slug: "water", title: "Водойми" },
  { slug: "history", title: "Історичні місця" },
  { slug: "photo", title: "Фотолокації" },
  { slug: "family", title: "Для дітей" },
];

export const eventCategories = [
  { slug: "concerts", title: "Концерти" },
  { slug: "festivals", title: "Фестивалі" },
  { slug: "children", title: "Дитячі" },
  { slug: "sport", title: "Спорт" },
  { slug: "workshops", title: "Майстер-класи" },
];

export const listingCategories = [
  { slug: "electronics", title: "Електроніка" },
  { slug: "phones", title: "Телефони" },
  { slug: "home", title: "Товари для дому" },
  { slug: "kids", title: "Дитячі товари" },
  { slug: "transport", title: "Транспорт" },
  { slug: "clothing", title: "Одяг і взуття" },
  { slug: "tools", title: "Інструменти" },
  { slug: "free", title: "Безкоштовно" },
];

export const newsItems: PortalEntity[] = [
  {
    slug: "juniors-games-ternopil-2026",
    title: "26–27 вересня на набережній відбудеться JuniorS Games",
    description:
      "Сімейний фестиваль біля центрального причалу триватиме з 12:00 до 19:00. Вхід вільний.",
    href: "/news/juniors-games-ternopil-2026",
    meta: "24 вересня 2026 · Події",
    badge: "Із джерелом",
    category: "podii",
    date: "2026-09-24",
    sourceUrl: "https://ternopilcity.gov.ua/news/103535.html",
    sourceLabel: "Тернопільська міська рада",
    content:
      "Тернопільська міська рада повідомила про сімейний фестиваль JuniorS Games 26 і 27 вересня біля центрального причалу на набережній Тернопільського ставу. Час роботи в обидва дні — 12:00–19:00, вхід вільний. Програма включає спортивні й творчі зони та активності для дітей і батьків. Перед відвідуванням уточнюйте зміни в організаторів за посиланням на джерело.",
  },
  {
    slug: "e-ternopil-ukryttia-2026",
    title:
      "У застосунку «е-Тернопіль» доступні сповіщення про тривогу та карта укриттів",
    description:
      "Міська рада пояснила, де в застосунку знайти найближче укриття.",
    href: "/news/e-ternopil-ukryttia-2026",
    meta: "24 вересня 2026 · Безпека",
    badge: "Із джерелом",
    category: "misto",
    date: "2026-09-24",
    sourceUrl: "https://ternopilcity.gov.ua/news/103524.html",
    sourceLabel: "Тернопільська міська рада",
    content:
      "За повідомленням Тернопільської міської ради, застосунок «е-Тернопіль» показує рівень повітряної тривоги й дає змогу знайти найближче укриття. Шлях у застосунку: «Карти» → «Укриття» → «Знайти найближче». Під час тривоги керуйтеся офіційними сповіщеннями та вказівками відповідних служб.",
  },
  {
    slug: "bibliofest-2026",
    title: "У Тернополі триває XVI фестиваль «БІБЛІОФЕСТ»",
    description:
      "24–25 вересня проходять книжкові презентації, зустрічі та майстер-класи.",
    href: "/news/bibliofest-2026",
    meta: "24 вересня 2026 · Культура",
    badge: "Із джерелом",
    category: "podii",
    date: "2026-09-24",
    sourceUrl: "https://ternopilcity.gov.ua/news/103534.html",
    sourceLabel: "Тернопільська міська рада",
    content:
      "У Тернополі 24 вересня відкрили XVI фестиваль «БІБЛІОФЕСТ» («ЧитаКоBookFest»), присвячений дитячій книзі й читанню. За інформацією міської ради, програма триває 24–25 вересня в Українському домі, бібліотеках та культурних осередках міста. Час окремих заходів уточнюйте в організаторів.",
  },
  {
    slug: "konkurs-miskoi-navihatsii-2026",
    title: "До 7 жовтня приймають пропозиції для міської навігації",
    description:
      "Міський конкурс запрошує дизайнерів і команди запропонувати систему інформаційних покажчиків.",
    href: "/news/konkurs-miskoi-navihatsii-2026",
    meta: "21 вересня 2026 · Місто",
    badge: "Із джерелом",
    category: "misto",
    date: "2026-09-21",
    sourceUrl: "https://ternopilcity.gov.ua/news/103449.html",
    sourceLabel: "Тернопільська міська рада",
    content:
      "Тернопільська міська рада запросила дизайнерів, архітекторів, урбаністів і команди до відкритого конкурсу на стиль інформаційної та туристичної навігації. Пропозиції приймають до 7 жовтня 2026 року включно. Умови та порядок подання наведені в офіційному повідомленні за посиланням.",
  },
];

export const places: PortalEntity[] = [
  {
    slug: "staryi-mlyn",
    title: "Старий Млин",
    description: "Музейна ресторація на Бродівській.",
    href: "/places/staryi-mlyn",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Бродівська, 1-А",
    coordinates: { lat: 49.5598289, lng: 25.5999327 },
    phone: "+380352519555",
    sourceUrl: "https://samogon.org/1201-staryj-mlyn",
    sourceLabel: "САМоГОНна Ресторація",
    content:
      "Музейна ресторація «Старий Млин» розташована на Бродівській, 1-А. Зателефонуйте закладу або перегляньте офіційне джерело, щоб уточнити графік і умови відвідування.",
  },
  {
    slug: "kovcheg",
    title: "Ковчег",
    description: "Пивоварна ресторація на вулиці Торговиця.",
    href: "/places/kovcheg",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Торговиця, 5-А",
    coordinates: { lat: 49.5478225, lng: 25.5849244 },
    phone: "+380352519555",
    instagram: "kovcheg_rest",
    sourceUrl: "https://samogon.org/1193-kovcheg",
    sourceLabel: "САМоГОНна Ресторація",
    content:
      "«Ковчег» — пивоварна ресторація на Торговиці, 5-А. Для актуального меню, графіка та бронювання скористайтеся сайтом або телефоном закладу.",
  },
  {
    slug: "faine-misto-pub",
    title: "Паб Файного міста",
    description: "Паб з кухнею в центрі Тернополя.",
    href: "/places/faine-misto-pub",
    meta: "Паб",
    category: "restaurants",
    address: "бульв. Тараса Шевченка, 23",
    coordinates: { lat: 49.5528852, lng: 25.5955804 },
    phone: "+380976001047",
    instagram: "faine_misto_pub",
    sourceUrl: "https://fainemisto.com/catalog/faine-misto/",
    sourceLabel: "Файне Місто",
    content:
      "Паб Файного міста розташований на бульварі Тараса Шевченка, 23. На сайті закладу є актуальні контакти, графік і меню.",
  },
  {
    slug: "na-nebi",
    title: "Na Nebi",
    description: "Ресторан у центрі Тернополя.",
    href: "/places/na-nebi",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Олени Кульчицької, 2",
    coordinates: { lat: 49.5522005, lng: 25.5960819 },
    phone: "+380682117711",
    instagram: "na.nebi",
    sourceUrl: "https://fainemisto.com/catalog/na-nebi/",
    sourceLabel: "Файне Місто",
    content:
      "Ресторан Na Nebi працює в центрі міста на вулиці Олени Кульчицької. Актуальне меню та контакти перевіряйте на сайті закладу.",
  },
  {
    slug: "koza-na-poshti",
    title: "Коза на Пошті",
    description: "Бар у центральній частині міста.",
    href: "/places/koza-na-poshti",
    meta: "Бар",
    category: "restaurants",
    address: "вул. В'ячеслава Чорновола, 4",
    coordinates: { lat: 49.5530144, lng: 25.5971329 },
    instagram: "koza.naposhti",
    sourceUrl: "https://www.instagram.com/koza.naposhti/",
    sourceLabel: "Сторінка закладу",
    content:
      "Бар «Коза на Пошті» розташований у центрі Тернополя. Актуальні події та графік перевіряйте на сторінці закладу.",
  },
  {
    slug: "river-premium-club",
    title: "River Premium Club",
    description: "Ресторанний простір біля Тернопільського ставу.",
    href: "/places/river-premium-club",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Чумацька, 1-А",
    coordinates: { lat: 49.5551, lng: 25.5772 },
    phone: "+380678287777",
    instagram: "theriver_premium",
    sourceUrl: "https://the-river.choiceqr.com/menu",
    sourceLabel: "Меню закладу",
    content:
      "River Premium Club розташований біля Тернопільського ставу. Для актуального меню, графіка й бронювання скористайтеся сторінкою закладу.",
  },
];

export const locations: PortalEntity[] = [
  {
    slug: "ternopilskyi-stav",
    title: "Тернопільський став",
    description:
      "Головний пішохідний маршрут, фото-точки та сезонні активності.",
    href: "/locations/ternopilskyi-stav",
    meta: "Вода і прогулянки",
    category: "water",
    address: "Центр Тернополя",
    coordinates: { lat: 49.5535, lng: 25.5878 },
    content:
      "Тернопільський став є однією з головних міських локацій. Поруч із набережною та парком Шевченка зручно почати прогулянку містом.",
  },
  {
    slug: "park-shevchenka",
    title: "Парк Шевченка",
    description: "Зелена зона поруч із центром і набережною.",
    href: "/locations/park-shevchenka",
    meta: "Парк",
    category: "parks",
    address: "парк ім. Т. Шевченка",
    coordinates: { lat: 49.5528, lng: 25.5871 },
    content:
      "Міський парк для прогулянок, дитячих активностей, фото і короткого відпочинку поряд з озером.",
  },
  {
    slug: "teatralnyi-maidan",
    title: "Театральний майдан",
    description: "Події, архітектура та міські маршрути в центрі.",
    href: "/locations/teatralnyi-maidan",
    meta: "Центр",
    category: "history",
    address: "Театральний майдан",
    coordinates: { lat: 49.5538, lng: 25.594 },
    content:
      "Центральна міська локація для подій, зустрічей, архітектурних прогулянок і переходу до закладів поруч.",
  },
  {
    slug: "ostriv-kokhannia",
    title: "Острів кохання",
    description: "Романтична фотолокація на Тернопільському ставі.",
    href: "/locations/ostriv-kokhannia",
    meta: "Фотолокація",
    category: "photo",
    address: "Тернопільський став",
    coordinates: { lat: 49.5508, lng: 25.5862 },
    content:
      "Фотолокація для прогулянок і сезонних маршрутів, поруч із набережною.",
  },
  {
    slug: "valova",
    title: "Вулиця Валова",
    description: "Прогулянкова вулиця з міською атмосферою і закладами.",
    href: "/locations/valova",
    meta: "Прогулянка",
    category: "history",
    address: "вул. Валова",
    coordinates: { lat: 49.5526, lng: 25.5932 },
    content:
      "Локація для міських прогулянок, кави, фото і переходу до каталогу закладів у центрі.",
  },
  {
    slug: "topilche",
    title: "Парк Топільче",
    description: "Велика зелена зона для прогулянок, дітей і спорту.",
    href: "/locations/topilche",
    meta: "Парк",
    category: "parks",
    address: "парк Топільче",
    coordinates: { lat: 49.5431, lng: 25.5889 },
    content:
      "Зелена зона для прогулянки, відпочинку з дітьми та рухливих ігор.",
  },
  {
    slug: "zamok",
    title: "Тернопільський замок",
    description: "Історична точка поруч зі ставом і центральними маршрутами.",
    href: "/locations/zamok",
    meta: "Історія",
    category: "history",
    address: "вул. Замкова",
    coordinates: { lat: 49.5521, lng: 25.5903 },
    content:
      "Поруч зі ставом, набережною та міськими прогулянковими маршрутами.",
  },
  {
    slug: "hidropark",
    title: "Гідропарк",
    description: "Активності біля води, прогулянки і сезонний відпочинок.",
    href: "/locations/hidropark",
    meta: "Вода",
    category: "water",
    address: "біля Тернопільського ставу",
    coordinates: { lat: 49.5469, lng: 25.5816 },
    content:
      "Прогулянкова зона біля водойми. Перед відвідуванням перевіряйте сезонні умови.",
  },
];

export const events: PortalEntity[] = [
  {
    slug: "juniors-games-ternopil-2026",
    title: "Сімейний фестиваль JuniorS Games",
    description:
      "Спорт, творчість та ігри для дітей і батьків. 26–27 вересня, 12:00–19:00.",
    href: "/events/juniors-games-ternopil-2026",
    meta: "26–27 вересня · 12:00–19:00",
    category: "children",
    date: "2026-09-26",
    endDate: "2026-09-27",
    address: "Набережна Тернопільського ставу, біля центрального причалу",
    price: "Вхід вільний",
    sourceUrl: "https://ternopilcity.gov.ua/news/103535.html",
    sourceLabel: "Програма й організатори",
    content:
      "Фестиваль JuniorS Games відбудеться 26 і 27 вересня з 12:00 до 19:00 на набережній Тернопільського ставу біля центрального причалу. Міська рада повідомляє про спортивні та творчі зони, ігри й активності для наймолодших. Вхід вільний. Перед виходом перевірте програму й можливі зміни за посиланням на організаторів.",
  },
  {
    slug: "bibliofest-ternopil-2026",
    title: "XVI фестиваль «БІБЛІОФЕСТ»",
    description:
      "Презентації книг, творчі зустрічі та майстер-класи 24–25 вересня.",
    href: "/events/bibliofest-ternopil-2026",
    meta: "24–25 вересня",
    category: "festivals",
    date: "2026-09-24",
    endDate: "2026-09-25",
    address: "Український дім, бібліотеки й культурні осередки Тернополя",
    sourceUrl: "https://ternopilcity.gov.ua/news/103534.html",
    sourceLabel: "Програма міської ради",
    content:
      "XVI фестиваль «БІБЛІОФЕСТ» («ЧитаКоBookFest») триває 24–25 вересня. Програму присвячено дитячій книзі й читанню. Місця та час окремих заходів уточнюйте в офіційному повідомленні та організаторів.",
  },
];

export const latestNews = newsItems.slice(0, 3);
export const popularPlaces = places.slice(0, 3);
export const popularLocations = locations.slice(0, 3);

export function getCityDate(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(at);
  const part = (type: string) =>
    parts.find((value) => value.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isUpcomingEvent(item: PortalEntity, today = getCityDate()) {
  return (item.endDate || item.date || "") >= today;
}

export function getUpcomingEvents(today = getCityDate()) {
  return events.filter((item) => isUpcomingEvent(item, today));
}

export const allSearchItems = [
  ...newsItems.map((item) => ({ ...item, type: "Новини" })),
  ...places.map((item) => ({ ...item, type: "Заклади" })),
  ...locations.map((item) => ({ ...item, type: "Локації" })),
  ...events.map((item) => ({ ...item, type: "Події" })),
];

export function findPortalEntity(collection: PortalEntity[], slug: string) {
  return collection.find((item) => item.slug === slug);
}
