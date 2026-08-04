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
    slug: "temperaturnyi-rekord-ternopil-2026",
    title: "У Тернополі зафіксували температурний рекорд",
    description:
      "3 серпня у місті оновили температурний максимум, а синоптики попереджають про спеку на початку тижня.",
    href: "/news/temperaturnyi-rekord-ternopil-2026",
    meta: "Погода",
    badge: "Актуально",
    category: "misto",
    date: "2026-08-04",
    sourceUrl: "https://suspilne.media/ternopil/archive/2026/8/4/",
    sourceLabel: "Суспільне Тернопіль",
    content:
      "За даними регіонального архіву Суспільного, 4 серпня 2026 року повідомили про температурний рекорд у Тернополі за 3 серпня. Картка додана як оперативний міський дайджест: варто стежити за прогнозом, брати воду в дорогу та планувати справи з урахуванням денної спеки.",
  },
  {
    slug: "perevirka-ukryttiv-ternopil-hromada",
    title: "У громаді перевіряють стан і доступність укриттів",
    description:
      "Міська рада повідомила про перевірку укриттів та нагадала про швидкий пошук найближчої захисної споруди.",
    href: "/news/perevirka-ukryttiv-ternopil-hromada",
    meta: "Безпека",
    badge: "Місто",
    category: "misto",
    date: "2026-08-04",
    sourceUrl:
      "https://ternopilcity.gov.ua/news/u-ternopilskiy-gromadi-tryvaye-perevirka-stanu-i-dostupnosti-ukryttiv-102750.html",
    sourceLabel: "Тернопільська міська рада",
    content:
      "4 серпня 2026 року Тернопільська міська рада повідомила, що у громаді триває перевірка стану і доступності укриттів. У картці порталу зібрано короткий міський контекст: тема належить до безпеки, її варто винести в карту сервісів і регулярно оновлювати після офіційних повідомлень.",
  },
  {
    slug: "knyhoobmin-biblioteky-ternopil-2026",
    title: "До 10 серпня у бібліотеках приймають книги для книгообміну",
    description:
      "У Тернополі збирають книги для всеукраїнського проєкту, сам обмін запланований на 16 серпня.",
    href: "/news/knyhoobmin-biblioteky-ternopil-2026",
    meta: "Культура",
    badge: "Подія",
    category: "podii",
    date: "2026-08-04",
    sourceUrl:
      "https://ternopilcity.gov.ua/news/do-10-serpnya-v-bibliotekah-ternopolya-pryymayut-knygy-dlya-masshtabnogo-knygoobminu-102753.html",
    sourceLabel: "Тернопільська міська рада",
    content:
      "Міська рада повідомила, що до 10 серпня у бібліотеках Тернополя приймають книги для масштабного книгообміну, який має відбутися 16 серпня. Портал показує це як міську культурну подію з датою, джерелом і коротким описом для швидкого перегляду.",
  },
  {
    slug: "kharchuvannia-shkoliariv-ternopilshchyny",
    title: "З 1 вересня школярі Тернопільщини харчуватимуться безкоштовно",
    description:
      "Суспільне внесло тему безкоштовного харчування школярів до денного архіву новин області.",
    href: "/news/kharchuvannia-shkoliariv-ternopilshchyny",
    meta: "Освіта",
    category: "misto",
    date: "2026-08-04",
    sourceUrl: "https://suspilne.media/ternopil/archive/2026/8/4/",
    sourceLabel: "Суспільне Тернопіль",
    content:
      "У новинному архіві Суспільного за 4 серпня 2026 року є повідомлення про безкоштовне харчування школярів Тернопільщини з 1 вересня. На порталі ця тема додана до міського дайджесту як важлива для батьків і освітніх закладів.",
  },
  {
    slug: "afisha-homin-berezil-serpen-2026",
    title: "Хор «Гомін» у Тернополі: події 4-5 серпня",
    description:
      "Афіша Karabas показує концерти хору «Гомін» у палаці культури «Березіль» на початку серпня.",
    href: "/news/afisha-homin-berezil-serpen-2026",
    meta: "Афіша",
    category: "podii",
    date: "2026-08-04",
    sourceUrl: "https://ternopil.karabas.com/august/",
    sourceLabel: "Karabas",
    content:
      "За афішею Karabas на серпень 2026 року, у Тернополі заплановані події хору «Гомін» у палаці культури «Березіль». Портал показує це як короткий анонс для розділу подій і переходу до офіційної сторінки продажу квитків.",
  },
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
    meta: "Ресторан · 4.6",
    badge: "Популярне",
    category: "restaurants",
    address: "вул. Бродівська, 1-А",
    rating: 4.6,
    coordinates: { lat: 49.5598289, lng: 25.5999327 },
    sourceUrl: "https://www.tripadvisor.co.uk/Restaurants-g681180-Ternopil_Ternopil_Oblast.html",
    sourceLabel: "Tripadvisor",
    content:
      "Старий Млин входить до найпомітніших ресторанів Тернополя у відкритих рейтингах. На порталі картка використовується як приклад повноцінного закладу з адресою, рейтингом, маршрутом на карті, відгуками, заявкою власника і додаванням в обране.",
  },
  {
    slug: "kovcheg",
    title: "Ковчег",
    description: "Пивоварна ресторація з європейською та грузинською кухнею.",
    href: "/places/kovcheg",
    meta: "Ресторан · 4.6",
    badge: "Популярне",
    category: "restaurants",
    address: "вул. Торговиця, 5-А",
    rating: 4.6,
    coordinates: { lat: 49.5478225, lng: 25.5849244 },
    phone: "+380352519555",
    instagram: "kovcheg_rest",
    sourceUrl: "https://www.tripadvisor.co.uk/Restaurants-g681180-Ternopil_Ternopil_Oblast.html",
    sourceLabel: "Tripadvisor",
    content:
      "Ковчег є одним із найвищих у ресторанному рейтингу Тернополя на Tripadvisor. У картці додано адресу, телефон, Instagram, рейтинг, точку на карті та маршрут, щоб користувач міг одразу перейти до дії.",
  },
  {
    slug: "faine-misto-pub",
    title: "Файне Місто Pub",
    description: "Великий паб у центрі міста з кухнею, пивом і доставкою.",
    href: "/places/faine-misto-pub",
    meta: "Паб · 4.2",
    badge: "Центр",
    category: "restaurants",
    address: "бульв. Тараса Шевченка, 23",
    rating: 4.2,
    coordinates: { lat: 49.5528852, lng: 25.5955804 },
    phone: "+380976001047",
    instagram: "faine_misto_pub",
    sourceUrl: "https://fainemisto.com/catalog/faine-misto/",
    sourceLabel: "Файне Місто",
    content:
      "Файне Місто Pub працює у центральній частині Тернополя на бульварі Тараса Шевченка. Картка підготовлена для каталогу закладів із контактами, графіком, посиланням на джерело, маршрутом і можливістю залишити відгук.",
  },
  {
    slug: "na-nebi",
    title: "Na Nebi",
    description: "Ресторан на 6 поверсі з кухнею, вином і видом на центр міста.",
    href: "/places/na-nebi",
    meta: "Ресторан · 4.4",
    category: "restaurants",
    address: "вул. О. Кульчицької, 2-А",
    rating: 4.4,
    coordinates: { lat: 49.5522005, lng: 25.5960819 },
    phone: "+380682117711",
    instagram: "na.nebi",
    sourceUrl: "https://nanebi.choiceqr.com/",
    sourceLabel: "Na Nebi menu",
    content:
      "Na Nebi додано як актуальний заклад у центрі Тернополя з відкритою адресою, телефоном, рейтингом і точкою на карті. На сторінці доступні дії для маршруту, обраного і відгуків після модерації.",
  },
  {
    slug: "koza-na-poshti",
    title: "Коза на Пошті",
    description: "Бар у просторі Na Пошті з крафтовим пивом і міською атмосферою.",
    href: "/places/koza-na-poshti",
    meta: "Бар",
    category: "restaurants",
    address: "вул. В'ячеслава Чорновола, 4",
    rating: 4.0,
    coordinates: { lat: 49.5530144, lng: 25.5971329 },
    instagram: "koza.naposhti",
    sourceUrl: "https://www.instagram.com/koza.naposhti/",
    sourceLabel: "Instagram",
    content:
      "Коза на Пошті додана як актуальний барний формат у центрі. Картка має адресу, Instagram, позначку на карті й підходить для сценарію, коли власник закладу надалі підтверджує сторінку та оновлює дані через модерацію.",
  },
  {
    slug: "river-premium-club",
    title: "River Premium Club",
    description: "Ресторан і клубний простір біля Тернопільського ставу.",
    href: "/places/river-premium-club",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Чумацька, 1-А",
    rating: 4.5,
    coordinates: { lat: 49.5551, lng: 25.5772 },
    phone: "+380678287777",
    instagram: "theriver_premium",
    sourceUrl: "https://the-river.choiceqr.com/menu",
    sourceLabel: "The River menu",
    content:
      "River Premium Club додано до популярних закладів як локацію біля ставу з відкритими контактами, меню, адресою та точкою на карті. Користувач може перейти до маршруту або зберегти заклад в обране.",
  },
  {
    slug: "oskar-restaurant",
    title: "Оскар",
    description: "Ресторан у центральній частині Тернополя на вулиці Крушельницької.",
    href: "/places/oskar-restaurant",
    meta: "Ресторан",
    category: "restaurants",
    address: "вул. Соломії Крушельницької, 18",
    rating: 4.4,
    coordinates: { lat: 49.5574972, lng: 25.5957775 },
    phone: "+380987975079",
    sourceUrl:
      "https://list.in.ua/%D0%A2%D0%B5%D1%80%D0%BD%D0%BE%D0%BF%D1%96%D0%BB%D1%8C/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D0%B8",
    sourceLabel: "List.in.ua",
    content:
      "Оскар додано як ресторан з відкритою адресою і контактами в міському каталозі. Ця картка також використовується на карті для перевірки маршруту, пошуку й фільтрації закладів.",
  },
  {
    slug: "flamingo-ternopil",
    title: "Flamingo",
    description: "Італійська кухня та піца у популярному міському форматі.",
    href: "/places/flamingo-ternopil",
    meta: "Італійська кухня · 4.3",
    category: "restaurants",
    address: "Тернопіль",
    rating: 4.3,
    coordinates: { lat: 49.5517, lng: 25.5968 },
    sourceUrl: "https://www.tripadvisor.co.uk/Restaurants-g681180-Ternopil_Ternopil_Oblast.html",
    sourceLabel: "Tripadvisor",
    content:
      "Flamingo входить до помітних ресторанних позицій у відкритих добірках Тернополя. Для публічного каталогу додано коротку картку, рейтинг, категорію і позначку на міській карті.",
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
    coordinates: { lat: 49.5538, lng: 25.594 },
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
    coordinates: { lat: 49.5535, lng: 25.5878 },
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
    coordinates: { lat: 49.5529, lng: 25.5907 },
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
    coordinates: { lat: 49.5528, lng: 25.5871 },
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
    coordinates: { lat: 49.5538, lng: 25.594 },
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
    coordinates: { lat: 49.5538, lng: 25.594 },
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
    coordinates: { lat: 49.5431, lng: 25.5889 },
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
    coordinates: { lat: 49.5538, lng: 25.594 },
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
    coordinates: { lat: 49.5535, lng: 25.5948 },
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
    coordinates: { lat: 49.5535, lng: 25.5878 },
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
export const popularPlaces = [
  "staryi-mlyn",
  "kovcheg",
  "faine-misto-pub",
  "na-nebi",
  "river-premium-club",
  "koza-na-poshti",
]
  .map((slug) => places.find((item) => item.slug === slug))
  .filter((item): item is PortalEntity => Boolean(item));
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
