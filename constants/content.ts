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
  status?: string;
};

export const cityStats = [
  { label: "розділів", value: "11" },
  { label: "типів ролей", value: "5" },
  { label: "ключових колекцій", value: "18+" },
  { label: "підхід", value: "mobile-first" },
];

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
  { slug: "free", title: "Безкоштовно" },
];

export const newsItems: PortalEntity[] = [
  {
    slug: "miska-afisha-vyhidnyh",
    title: "Міська афіша вихідних",
    description: "Концерти, виставки, дитячі події та прогулянки біля ставу.",
    href: "/news/miska-afisha-vyhidnyh",
    meta: "Події",
    badge: "Нове",
    category: "podii",
    date: "2026-08-07",
    content:
      "Добірка найближчих подій допомагає швидко спланувати вихідні: камерні концерти, сімейні майстер-класи, прогулянки біля ставу та виставки у центрі. Редакція порталу збирає лише ті анонси, де є дата, місце, контакт організатора і зрозумілий статус.",
  },
  {
    slug: "onovlennia-naberezhnoi",
    title: "Оновлення набережної",
    description: "Що змінюється на пішохідних маршрутах біля Тернопільського ставу.",
    href: "/news/onovlennia-naberezhnoi",
    meta: "Місто",
    category: "misto",
    date: "2026-08-06",
    content:
      "Набережна лишається одним із головних маршрутів Тернополя. У матеріалі зібрані зміни для пішоходів, велосипедистів і гостей міста: навігація, освітлення, місця відпочинку, доступність і корисні точки поруч.",
  },
  {
    slug: "simeini-lokatsii",
    title: "Добірка сімейних локацій",
    description: "Парки, дитячі простори та безкоштовні місця для прогулянок.",
    href: "/news/simeini-lokatsii",
    meta: "Локації",
    category: "lokatsii",
    date: "2026-08-05",
    content:
      "У добірці зібрані локації для родинного відпочинку: парки, майданчики, спокійні прогулянкові маршрути, місця з тінню і доступом до води. Кожна локація має короткий опис, адресу, категорію та майбутню прив'язку до карти.",
  },
  {
    slug: "novi-pravyla-dlia-oholoshen",
    title: "Нові правила для оголошень",
    description: "Як працюватиме модерація, скарги, фото й позначка продано.",
    href: "/news/novi-pravyla-dlia-oholoshen",
    meta: "Барахолка",
    category: "misto",
    date: "2026-08-04",
    content:
      "Оголошення на порталі проходитимуть базову перевірку: обмеження кількості фото, заборона спаму, причина відхилення, повторна подача та можливість позначити товар проданим. Контакт між людьми відбувається телефоном або через зовнішні соцмережі.",
  },
  {
    slug: "biznes-kabinet-vlasnyka",
    title: "Як працюватиме кабінет власника",
    description: "Фото, меню, акції, події, відповіді на відгуки та статистика.",
    href: "/news/biznes-kabinet-vlasnyka",
    meta: "Бізнес",
    category: "biznes",
    date: "2026-08-03",
    content:
      "Власники закладів зможуть подавати заявку на керування сторінкою, редагувати дані через модерацію, додавати меню, акції, події та переглядати статистику кліків. Важливі зміни не публікуються без перевірки.",
  },
  {
    slug: "transportni-onovlennia",
    title: "Транспортні оновлення тижня",
    description: "Коротко про маршрути, зупинки та корисні точки для пересування.",
    href: "/news/transportni-onovlennia",
    meta: "Транспорт",
    category: "transport",
    date: "2026-08-02",
    content:
      "Транспортний розділ збирає практичні оновлення для щоденних поїздок: зміни маршрутів, нові зупинки, велопарковки, зарядні станції й точки пересадки. Інформація готується до відображення на карті.",
  },
  {
    slug: "hid-po-kaviarniakh",
    title: "Гід по кав'ярнях у центрі",
    description: "Місця для кави, зустрічей і короткої роботи з ноутбуком.",
    href: "/news/hid-po-kaviarniakh",
    meta: "Заклади",
    category: "biznes",
    date: "2026-08-01",
    content:
      "Кав'ярні центру отримують окрему добірку з фільтрами: графік, середній чек, наявність Wi‑Fi, оплата карткою, pet-friendly і швидкі контакти. Рейтинг формується з перевірених відгуків.",
  },
  {
    slug: "bezbariernyi-ternopil",
    title: "Безбар'єрний Тернопіль",
    description: "Які об'єкти матимуть позначки доступності в каталозі.",
    href: "/news/bezbariernyi-ternopil",
    meta: "Місто",
    category: "misto",
    date: "2026-07-31",
    content:
      "Портал додає ознаки доступності до закладів і локацій: пандус, зручний вхід, туалет, ширина проходів, дитяча кімната й можливість швидкого контакту. Дані проходять перевірку перед публікацією.",
  },
  {
    slug: "podii-dlia-ditei",
    title: "Події для дітей цього місяця",
    description: "Майстер-класи, вистави, активності на вихідні та сімейні формати.",
    href: "/news/podii-dlia-ditei",
    meta: "Дитячі",
    category: "podii",
    date: "2026-07-30",
    content:
      "Дитячі події матимуть окремі фільтри за віком, ціною, районом і датою. Організатори зможуть подавати події, а модератори перевірятимуть контактні дані та опис.",
  },
  {
    slug: "yak-pratsiuie-poshuk",
    title: "Як працює глобальний пошук",
    description: "Пошук по новинах, закладах, локаціях, подіях та оголошеннях.",
    href: "/news/yak-pratsiuie-poshuk",
    meta: "Сервіс",
    category: "misto",
    date: "2026-07-29",
    content:
      "Пошук об'єднує основні розділи порталу. У наступних етапах він отримає автодоповнення, історію запитів у браузері, підсвічування збігів і фільтри за типом результату.",
  },
];

export const places: PortalEntity[] = [
  {
    slug: "kaviarni",
    title: "Кав'ярні в центрі",
    description: "Місця для ранкової кави, зустрічей і роботи з ноутбуком.",
    href: "/places/kaviarni",
    meta: "12 закладів",
    category: "kaviarni",
    address: "Центр Тернополя",
    rating: 4.7,
    coordinates: { lat: 49.5535, lng: 25.5948 },
    content:
      "Добірка кав'ярень у центральній частині міста з контактами, графіком, середнім чеком, зручностями та майбутніми відгуками користувачів.",
  },
  {
    slug: "restaurants",
    title: "Ресторани для вечері",
    description: "Заклади з рейтингом, фото, меню та відкритими контактами.",
    href: "/places/restaurants",
    meta: "8 закладів",
    category: "restaurants",
    address: "Тернопіль",
    rating: 4.6,
    coordinates: { lat: 49.5519, lng: 25.5943 },
    content:
      "Категорія ресторанів для вечері, сімейних зустрічей і подій. Картки закладів підтримують галерею, меню, контакти, соцмережі й заявку власника.",
  },
  {
    slug: "sport",
    title: "Спорт і відновлення",
    description: "Зали, студії, басейни та послуги для активного ритму.",
    href: "/places/sport",
    meta: "9 закладів",
    category: "sport",
    address: "Різні райони",
    rating: 4.5,
    coordinates: { lat: 49.5572, lng: 25.5961 },
    content:
      "Спортивні клуби, студії, тренажерні зали та послуги відновлення з фільтрами за районом, графіком, ціною і доступністю.",
  },
  {
    slug: "staryi-mlyn",
    title: "Старий Млин",
    description: "Атмосферний ресторан української кухні з історичним інтер'єром.",
    href: "/places/staryi-mlyn",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Бродівська, Тернопіль",
    rating: 4.8,
    coordinates: { lat: 49.5601, lng: 25.6032 },
    content:
      "Сторінка закладу містить опис, галерею, контакти, графік роботи, меню, відгуки, відповідь власника, кнопку маршруту й можливість додати в обране.",
  },
  {
    slug: "teatralna-kava",
    title: "Театральна кава",
    description: "Кав'ярня біля театрального майдану для коротких зустрічей.",
    href: "/places/teatralna-kava",
    meta: "Кав'ярня",
    category: "kaviarni",
    address: "Театральний майдан",
    rating: 4.4,
    coordinates: { lat: 49.5537, lng: 25.5939 },
    content:
      "Приклад картки кав'ярні з графіком, соціальними мережами, фото, середнім чеком і швидкими кнопками зв'язку.",
  },
  {
    slug: "family-space",
    title: "Family Space",
    description: "Сімейний простір з дитячими активностями і майстер-класами.",
    href: "/places/family-space",
    meta: "Діти",
    category: "services",
    address: "вул. Руська, Тернопіль",
    rating: 4.6,
    coordinates: { lat: 49.5529, lng: 25.5907 },
    content:
      "Сторінка сервісу для дітей підтримує події, відгуки, галерею, ціни, контакти і заявку власника для керування даними.",
  },
  {
    slug: "velo-service",
    title: "Velo Service",
    description: "Майстерня для ремонту велосипедів і сезонного обслуговування.",
    href: "/places/velo-service",
    meta: "Послуги",
    category: "services",
    address: "Дружба",
    rating: 4.3,
    coordinates: { lat: 49.5453, lng: 25.5724 },
    content:
      "Сервісна картка з телефоном, Telegram, графіком, списком послуг і майбутньою статистикою кліків для власника.",
  },
  {
    slug: "book-corner",
    title: "Book Corner",
    description: "Невелика книгарня з локальними подіями й клубними зустрічами.",
    href: "/places/book-corner",
    meta: "Магазин",
    category: "shops",
    address: "Центр",
    rating: 4.7,
    coordinates: { lat: 49.5541, lng: 25.5921 },
    content:
      "Приклад магазину з каталогом подій, контактами, соціальними мережами та можливістю власника додавати акції.",
  },
  {
    slug: "dnistro-fitness",
    title: "Dnistro Fitness",
    description: "Фітнес-клуб із груповими заняттями й ранковими тренуваннями.",
    href: "/places/dnistro-fitness",
    meta: "Спорт",
    category: "sport",
    address: "Східний масив",
    rating: 4.2,
    coordinates: { lat: 49.5617, lng: 25.6183 },
    content:
      "Картка спортивного закладу з фільтрами за графіком, ціною, напрямом тренувань, можливістю додати фото і відповідати на відгуки.",
  },
  {
    slug: "green-market",
    title: "Green Market",
    description: "Магазин локальних продуктів і фермерських товарів.",
    href: "/places/green-market",
    meta: "Магазин",
    category: "shops",
    address: "Новий світ",
    rating: 4.5,
    coordinates: { lat: 49.5586, lng: 25.5872 },
    content:
      "Приклад торгової точки з особливостями, способом оплати, контактами, фото і можливістю заявити право власності.",
  },
];

export const locations: PortalEntity[] = [
  {
    slug: "ternopilskyi-stav",
    title: "Тернопільський став",
    description: "Головний пішохідний маршрут, фото-точки та сезонні активності.",
    href: "/locations/ternopilskyi-stav",
    meta: "Вода і прогулянки",
    category: "water",
    address: "Центр Тернополя",
    coordinates: { lat: 49.5535, lng: 25.5878 },
    content:
      "Тернопільський став є однією з головних міських локацій. Сторінка містить опис, фото, маршрути, корисні точки поруч, події і майбутню інтеграцію з картою.",
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
      "Фотолокація для прогулянок і сезонних маршрутів, яка буде відображатися на карті з корисними точками поруч.",
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
    content: "Локація для міських прогулянок, кави, фото і переходу до каталогу закладів у центрі.",
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
      "Парк Топільче додається як сімейна й спортивна локація з майбутніми фільтрами за активностями.",
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
    content: "Історична локація з описом, маршрутом, фото і майбутніми пов'язаними матеріалами.",
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
      "Локація для літнього відпочинку з майбутніми позначками сервісів, туалетів, парковок і доступності.",
  },
  {
    slug: "children-route",
    title: "Дитячий маршрут",
    description: "Місця для прогулянок з дітьми у центральній частині міста.",
    href: "/locations/children-route",
    meta: "Для дітей",
    category: "family",
    address: "центр і парк Шевченка",
    coordinates: { lat: 49.5533, lng: 25.5904 },
    content:
      "Добірка точок для прогулянок з дітьми з фільтрами за віком, доступністю й безкоштовними активностями.",
  },
  {
    slug: "photo-spots-center",
    title: "Фото-точки центру",
    description: "Короткий маршрут для фото в центральній частині Тернополя.",
    href: "/locations/photo-spots-center",
    meta: "Фото",
    category: "photo",
    address: "центр міста",
    coordinates: { lat: 49.5534, lng: 25.593 },
    content:
      "Маршрут з точками для фото, який поєднує став, театральний майдан, Валовову і заклади поруч.",
  },
];

export const events: PortalEntity[] = [
  {
    slug: "vechir-ukrainskoi-muzyky",
    title: "Вечір української музики",
    description: "Камерний концерт у центрі міста з попередньою реєстрацією.",
    href: "/events/vechir-ukrainskoi-muzyky",
    meta: "П'ятниця, 18:00",
    category: "concerts",
    date: "2026-08-07",
    address: "центр міста",
    price: "250 грн",
    content:
      "Подія має дату, час, організатора, місце, контакт і статус. У майбутньому минулі події автоматично переходитимуть в архів.",
  },
  {
    slug: "fotoprohulianka-bilia-stavu",
    title: "Фотопрогулянка біля ставу",
    description: "Маршрут для нових кадрів і знайомства з міськими локаціями.",
    href: "/events/fotoprohulianka-bilia-stavu",
    meta: "Субота, 10:00",
    category: "workshops",
    date: "2026-08-08",
    address: "Тернопільський став",
    price: "Безкоштовно",
    content:
      "Фотопрогулянка поєднує міські локації, маршрути і заклади поруч. Події власників закладів проходять модерацію перед публікацією.",
  },
  {
    slug: "maister-klas-dlia-ditei",
    title: "Майстер-клас для дітей",
    description: "Творча зустріч у сімейному просторі з модерацією подій.",
    href: "/events/maister-klas-dlia-ditei",
    meta: "Неділя, 12:00",
    category: "children",
    date: "2026-08-09",
    address: "Family Space",
    price: "180 грн",
    content:
      "Дитяча подія з описом вікової групи, організатором, адресою, контактами і майбутньою прив'язкою до закладу.",
  },
  {
    slug: "rankovyi-zabih",
    title: "Ранковий забіг",
    description: "Спортивна зустріч для містян біля парку Шевченка.",
    href: "/events/rankovyi-zabih",
    meta: "Субота, 08:00",
    category: "sport",
    date: "2026-08-15",
    address: "парк Шевченка",
    price: "Безкоштовно",
    content:
      "Спортивні події мають фільтри за датою, типом, ціною і локацією. Для безпеки організаторські дані перевіряються модератором.",
  },
  {
    slug: "lokalnyi-market",
    title: "Локальний маркет",
    description: "Маркет локальних брендів, їжі та виробників.",
    href: "/events/lokalnyi-market",
    meta: "18 серпня",
    category: "festivals",
    date: "2026-08-18",
    address: "центр Тернополя",
    price: "Вхід вільний",
    content:
      "Фестиваль локального бізнесу з можливістю додати пов'язані заклади, акції та рекламні блоки.",
  },
  {
    slug: "teatralnyi-vechir",
    title: "Театральний вечір",
    description: "Вистава у центрі міста з переходом до квитків організатора.",
    href: "/events/teatralnyi-vechir",
    meta: "20 серпня",
    category: "concerts",
    date: "2026-08-20",
    address: "Театральний майдан",
    price: "від 200 грн",
    content:
      "Подія демонструє сценарій зовнішнього ticket URL без внутрішнього бронювання, як вимагає технічне завдання.",
  },
  {
    slug: "family-picnic",
    title: "Сімейний пікнік",
    description: "Денна подія для родин у парку з активностями для дітей.",
    href: "/events/family-picnic",
    meta: "23 серпня",
    category: "children",
    date: "2026-08-23",
    address: "парк Топільче",
    price: "Безкоштовно",
    content:
      "Сімейна подія з категорією, адресою, ціною і майбутнім автоматичним архівуванням після дати завершення.",
  },
  {
    slug: "workshop-for-business",
    title: "Воркшоп для бізнесу",
    description: "Як оформити сторінку закладу, фото, меню та відгуки.",
    href: "/events/workshop-for-business",
    meta: "25 серпня",
    category: "workshops",
    date: "2026-08-25",
    address: "центр міста",
    price: "Реєстрація",
    content:
      "Подія для власників закладів, яка пояснює роботу кабінету, заявки власника, модерації і статистики.",
  },
  {
    slug: "charity-evening",
    title: "Благодійний вечір",
    description: "Збір коштів і локальні виступи у партнерському просторі.",
    href: "/events/charity-evening",
    meta: "28 серпня",
    category: "festivals",
    date: "2026-08-28",
    address: "Тернопіль",
    price: "Донат",
    content:
      "Благодійні події отримують прозорі контакти організатора, опис мети й посилання на зовнішню сторінку збору.",
  },
  {
    slug: "cycling-day",
    title: "Велодень",
    description: "Маршрут містом з позначками сервісів і точок відпочинку.",
    href: "/events/cycling-day",
    meta: "30 серпня",
    category: "sport",
    date: "2026-08-30",
    address: "старт біля ставу",
    price: "Безкоштовно",
    content: "Велоподія показує зв'язок подій, карти, локацій і корисних точок на одному порталі.",
  },
];

export const listings: PortalEntity[] = [
  {
    slug: "velosyped-miskyi",
    title: "Велосипед міський",
    description: "Стан добрий, район Дружба, зв'язок телефоном або Telegram.",
    href: "/market/velosyped-miskyi",
    meta: "4 800 грн",
    category: "home",
    price: "4 800 грн",
    status: "active",
    content:
      "Оголошення має фото, опис, ціну, район, контакти, статус і можливість позначити товар проданим.",
  },
  {
    slug: "stil-pysmovyi",
    title: "Стіл письмовий",
    description: "Самовивіз, фото перевіряються перед публікацією.",
    href: "/market/stil-pysmovyi",
    meta: "1 200 грн",
    category: "home",
    price: "1 200 грн",
    status: "active",
    content: "Приклад оголошення з обмеженням фото, модерацією і контактом поза внутрішнім чатом.",
  },
  {
    slug: "kvitky-na-podiiu",
    title: "Квитки на подію",
    description: "Оголошення з обмеженим терміном активності та скаргами.",
    href: "/market/kvitky-na-podiiu",
    meta: "Обмін",
    category: "free",
    price: "Обмін",
    status: "active",
    content:
      "Оголошення може мати строк активності, повторну активацію, скарги та автоматичний архів після завершення.",
  },
  {
    slug: "iphone-13-pro-ternopil",
    title: "iPhone 13 Pro",
    description: "128 GB, стан гарний, перевірка при зустрічі.",
    href: "/market/iphone-13-pro-ternopil",
    meta: "18 500 грн",
    category: "phones",
    price: "18 500 грн",
    status: "active",
    content:
      "Категорія телефонів підтримує фільтри за ціною, станом, районом і контактним каналом.",
  },
  {
    slug: "noutbuk-dlia-navchannia",
    title: "Ноутбук для навчання",
    description: "Підійде для документів, браузера та онлайн-занять.",
    href: "/market/noutbuk-dlia-navchannia",
    meta: "7 900 грн",
    category: "electronics",
    price: "7 900 грн",
    status: "pending",
    content:
      "Оголошення на модерації видно власнику у кабінеті, а публічно з'являється після схвалення.",
  },
  {
    slug: "dytiachyi-velosyped",
    title: "Дитячий велосипед",
    description: "Для віку 5-7 років, є додаткові колеса.",
    href: "/market/dytiachyi-velosyped",
    meta: "1 600 грн",
    category: "kids",
    price: "1 600 грн",
    status: "active",
    content:
      "Дитячі товари мають ті самі правила модерації, фото, скарг і статусів, що й інші оголошення.",
  },
  {
    slug: "komod-derevianyi",
    title: "Комод дерев'яний",
    description: "Самовивіз з Нового світу, стан добрий.",
    href: "/market/komod-derevianyi",
    meta: "2 300 грн",
    category: "home",
    price: "2 300 грн",
    status: "active",
    content:
      "Оголошення для товарів дому з районом, фото й контактним способом без внутрішнього чату.",
  },
  {
    slug: "monitor-24",
    title: "Монітор 24 дюйми",
    description: "Full HD, без битих пікселів, район Центр.",
    href: "/market/monitor-24",
    meta: "3 200 грн",
    category: "electronics",
    price: "3 200 грн",
    status: "active",
    content: "Електроніка має додатковий фільтр за станом товару і можливість скарги.",
  },
  {
    slug: "knyhy-bezkoshtovno",
    title: "Книги безкоштовно",
    description: "Добірка художньої літератури, самовивіз.",
    href: "/market/knyhy-bezkoshtovno",
    meta: "Безкоштовно",
    category: "free",
    price: "0 грн",
    status: "active",
    content:
      "Безкоштовні оголошення проходять ті самі антиспам-перевірки й мають строк активності.",
  },
  {
    slug: "dytyache-krislo",
    title: "Дитяче крісло",
    description: "Автокрісло після однієї дитини, стан добрий.",
    href: "/market/dytyache-krislo",
    meta: "2 000 грн",
    category: "kids",
    price: "2 000 грн",
    status: "sold",
    content:
      "Продані оголошення не мають індексуватися і можуть бути приховані з активного пошуку.",
  },
  {
    slug: "router-wifi",
    title: "Wi‑Fi роутер",
    description: "Працює стабільно, комплект повний.",
    href: "/market/router-wifi",
    meta: "650 грн",
    category: "electronics",
    price: "650 грн",
    status: "active",
    content: "Оголошення з малим товаром, швидким контактом і можливістю додати в обране.",
  },
  {
    slug: "smartwatch",
    title: "Смарт-годинник",
    description: "Стан майже новий, зарядний кабель у комплекті.",
    href: "/market/smartwatch",
    meta: "1 900 грн",
    category: "electronics",
    price: "1 900 грн",
    status: "active",
    content: "Стан товару зберігається окремим полем для фільтрів і схожих оголошень.",
  },
  {
    slug: "telefon-xiaomi",
    title: "Телефон Xiaomi",
    description: "Бюджетний смартфон для дзвінків і месенджерів.",
    href: "/market/telefon-xiaomi",
    meta: "2 400 грн",
    category: "phones",
    price: "2 400 грн",
    status: "active",
    content: "Контакт можна обрати телефоном, Telegram або Instagram без внутрішнього чату.",
  },
  {
    slug: "dytiachyi-stilchyk",
    title: "Дитячий стільчик",
    description: "Для годування, складається, є ремені.",
    href: "/market/dytiachyi-stilchyk",
    meta: "900 грн",
    category: "kids",
    price: "900 грн",
    status: "active",
    content: "Оголошення дитячих товарів підтримують фото, опис, район і скарги.",
  },
  {
    slug: "polychka",
    title: "Поличка настінна",
    description: "Легка полиця для книг або декору.",
    href: "/market/polychka",
    meta: "350 грн",
    category: "home",
    price: "350 грн",
    status: "archived",
    content:
      "Архівні оголошення доступні власнику в кабінеті, але не мають бути у публічній видачі.",
  },
];

export const latestNews = newsItems.slice(0, 3);
export const popularPlaces = places.slice(0, 3);
export const popularLocations = locations.slice(0, 3);
export const upcomingEvents = events.slice(0, 3);
export const marketHighlights = listings.slice(0, 3);

export const allSearchItems = [
  ...newsItems.map((item) => ({ ...item, type: "Новини" })),
  ...places.map((item) => ({ ...item, type: "Заклади" })),
  ...locations.map((item) => ({ ...item, type: "Локації" })),
  ...events.map((item) => ({ ...item, type: "Події" })),
  ...listings.map((item) => ({ ...item, type: "Барахолка" })),
];

export function findPortalEntity(collection: PortalEntity[], slug: string) {
  return collection.find((item) => item.slug === slug);
}
