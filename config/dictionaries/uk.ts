export const uk = {
  common: {
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
    search: "Пошук",
    searchPlaceholder: "Пошук новин, закладів, подій або оголошень",
    submitSearch: "Знайти",
    readMore: "Детальніше",
    viewAll: "Переглянути все",
    addListing: "Додати оголошення",
    addPlace: "Додати заклад",
    route: "Маршрут",
    themeLight: "Увімкнути світлу тему",
    themeDark: "Увімкнути темну тему",
    themeSystem: "Тема сайту",
    loading: "Завантаження",
    backHome: "На головну",
    tryAgain: "Спробувати ще раз",
    admin: "Адмінпанель",
    login: "Вхід",
    register: "Реєстрація",
    profile: "Профіль",
    logout: "Вийти",
  },
  navigation: {
    primary: [
      { href: "/news", label: "Новини" },
      { href: "/places", label: "Заклади" },
      { href: "/locations", label: "Локації" },
      { href: "/events", label: "Події" },
      { href: "/map", label: "Карта" },
      { href: "/market", label: "Барахолка" },
    ],
    account: [
      { href: "/login", label: "Вхід" },
      { href: "/register", label: "Реєстрація" },
      { href: "/profile", label: "Кабінет" },
    ],
  },
  footer: {
    tagline: "Міський портал для щоденного життя Тернополя.",
    sectionsTitle: "Розділи",
    serviceTitle: "Сервіс",
    legalTitle: "Документи",
    legalLinks: [
      { href: "/privacy", label: "Політика конфіденційності" },
      { href: "/terms", label: "Правила користування" },
      { href: "/contacts", label: "Контакти" },
    ],
    serviceLinks: [
      { href: "/register", label: "Створити профіль" },
      { href: "/profile", label: "Особистий кабінет" },
      { href: "/owner", label: "Кабінет власника" },
      { href: "/moderation", label: "Модерація" },
      { href: "/admin", label: "Адмінпанель" },
    ],
  },
  home: {
    eyebrow: "Де Тернопіль",
    title: "Де Тернопіль",
    description:
      "Місто. Люди. Можливості. Новини, заклади, локації, події, оголошення та карта Тернополя в одному місці.",
    latestNews: "Останні новини",
    popularPlaces: "Заклади міста",
    upcomingEvents: "Найближчі події",
    marketHighlights: "Оголошення",
    cityMap: "Карта міста",
    collections: "Добірки",
    businessBlock: {
      title: "Для власників бізнесу",
      description:
        "Підтвердіть право на сторінку свого закладу й подайте оновлення даних через модерацію.",
      action: "Кабінет власника",
    },
    listingBlock: {
      title: "Міська барахолка",
      description:
        "Публікуйте оголошення після підтвердження email. Продажі й зв’язок із продавцем відбуваються поза сайтом.",
      action: "Додати оголошення",
    },
  },
  pages: {
    notFoundTitle: "Сторінку не знайдено",
    notFoundDescription:
      "Посилання може бути застарілим або розділ ще не відкритий.",
    errorTitle: "Сталася помилка",
    errorDescription: "Сторінка не завантажилась коректно. Повторіть спробу.",
  },
  auth: {
    registerTitle: "Створити профіль",
    registerDescription:
      "Після реєстрації користувач отримує базову роль user, може зберігати обране, залишати відгуки та створювати оголошення.",
    loginTitle: "Увійти",
    loginDescription:
      "Вхід потрібен для кабінету, оголошень, відгуків і заявок власника закладу.",
    databaseMissing: "Сервіс тимчасово недоступний. Спробуйте пізніше.",
    profileCreated:
      "Профіль створено. Тепер можна перейти в особистий кабінет.",
    loginSuccess: "Вхід виконано.",
  },
  profile: {
    title: "Особистий кабінет",
    description:
      "Тут користувач керує профілем, оголошеннями, обраним, відгуками, скаргами та сповіщеннями.",
    signedOut: "Щоб побачити кабінет, потрібно увійти або створити профіль.",
  },
  admin: {
    title: "Адміністративна панель",
    description:
      "Центр керування користувачами, ролями, контентом, модерацією, рекламою, головною сторінкою та журналом дій.",
  },
} as const;
