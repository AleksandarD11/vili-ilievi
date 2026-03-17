export type LanguageCode = "BG" | "EN";

export type LocalizedText = Record<LanguageCode, string>;
export type LocalizedList = Record<LanguageCode, string[]>;

export type HouseRecord = {
  id: string;
  name: LocalizedText;
  capacity: LocalizedText;
  description: LocalizedText;
  price: LocalizedText;
  details: LocalizedList;
  coverImage: string;
  imagePaths: string[];
};

export type AvailabilityStatus = "available" | "reserved" | "occupied";

export type AvailabilityEntry = {
  id: string;
  houseId: string;
  date: string;
  status: AvailabilityStatus;
  guests: number;
};

export type InquiryRecord = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  houseId: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  message: string;
  status: InquiryStatus;
  adminNotes: string;
  createdAt: string;
  imagePaths: string[];
};

export type InquiryStatus = "new" | "pending_deposit" | "deposit_paid" | "cancelled";

export type AmenityRecord = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
};

export type OfferRecord = {
  title: LocalizedText;
  badge: LocalizedText;
  price: LocalizedText;
  details: LocalizedText;
};

export type FaqRecord = {
  question: LocalizedText;
  answer: LocalizedText;
};

export const adminCredentials = {
  username: "admin",
  password: "vili123",
};

export const heroImages = {
  main: [
    "/images/houses/main-page/223344-1.jpg",
    "/images/houses/main-page/unnamed-file-27.jpg",
  ],
  pool: [
    "/images/pool/00.jpg",
    "/images/pool/00888.jpg",
    "/images/pool/111.jpg",
    "/images/pool/1122.jpg",
    "/images/pool/223344.jpg",
    "/images/pool/44.jpg",
    "/images/pool/7788.jpg",
    "/images/pool/9900.jpg",
    "/images/pool/99-1.jpg",
    "/images/pool/unnamed-file-1.jpg",
    "/images/pool/unnamed-file-11.jpg",
    "/images/pool/unnamed-file-13.jpg",
    "/images/pool/unnamed-file-18.jpg",
    "/images/pool/unnamed-file-2.jpg",
    "/images/pool/unnamed-file-23.jpg",
    "/images/pool/unnamed-file-24.jpg",
    "/images/pool/unnamed-file-5.jpg",
    "/images/pool/unnamed-file-8.jpg",
    "/images/pool/viber_2025-06-24_01-34-36-485.jpg",
    "/images/pool/viber_2025-06-24_01-34-38-206.jpg88.jpg",
    "/images/pool/WhatsApp-Image-2025-06-24-at-01.16.49_dc84ddd0.jpg",
  ],
};

export const defaultHouses: HouseRecord[] = [
  {
    id: "house-1",
    name: { BG: "Къща 1", EN: "House 1" },
    capacity: { BG: "1-11 гости", EN: "1-11 guests" },
    description: {
      BG: "Двуетажна вила с просторна веранда, градинска зона и външно джакузи за спокойни вечери сред боровете.",
      EN: "A two-storey villa with a spacious veranda, garden area, and outdoor jacuzzi for relaxed evenings among the pines.",
    },
    price: { BG: "от 590 лв.", EN: "from 590 BGN" },
    details: {
      BG: ["2 етажа", "Панорамна веранда", "Външно джакузи", "Камина и BBQ зона"],
      EN: ["2 floors", "Panoramic veranda", "Outdoor jacuzzi", "Fireplace and BBQ area"],
    },
    coverImage: "/images/houses/house-1/IMG_20221208_214410_712.webp",
    imagePaths: [
      "/images/houses/house-1/IMG_20221208_214410_712.webp",
      "/images/houses/house-1/IMG_7562-2048x1365.jpg",
      "/images/houses/house-1/IMG_7564-2048x1365.jpg",
      "/images/houses/house-1/IMG_7572-2048x1365.jpg",
      "/images/houses/house-1/IMG_7578-2048x1365.jpg",
      "/images/houses/house-1/IMG_7580-2048x1365.jpg",
      "/images/houses/house-1/IMG_7594-scaled.jpg",
      "/images/houses/house-1/IMG_7596-2048x1365.jpg",
      "/images/houses/house-1/IMG_7599-2048x1365.jpg",
      "/images/houses/house-1/IMG_7601-2048x1365.jpg",
      "/images/houses/house-1/IMG-50e901a515a4b7187bb5c882572cd7cb-V-1.jpg.jpg",
      "/images/houses/house-1/WhatsApp-Image-2025-07-01-at-15.47.24_e6203f7c.jpg",
      "/images/houses/house-1/WhatsApp-Image-2025-07-01-at-15.47.38_fc9c2cba.jpg",
    ],
  },
  {
    id: "house-2",
    name: { BG: "Къща 2", EN: "House 2" },
    capacity: { BG: "1-8 гости", EN: "1-8 guests" },
    description: {
      BG: "Топъл алпийски интериор с две нива, самостоятелна веранда и уютна семейна атмосфера за пълен релакс.",
      EN: "A warm alpine interior with two levels, a private veranda, and a cozy family atmosphere for complete relaxation.",
    },
    price: { BG: "от 540 лв.", EN: "from 540 BGN" },
    details: {
      BG: ["2 етажа", "Частна веранда", "Семейна трапезария", "Планински уют"],
      EN: ["2 floors", "Private veranda", "Family dining area", "Mountain comfort"],
    },
    coverImage: "/images/houses/house-2/IMG_7593-scaled.jpg",
    imagePaths: [
      "/images/houses/house-2/IMG_7593-scaled.jpg",
      "/images/houses/house-2/IMG_7624-2048x1365.jpg",
      "/images/houses/house-2/IMG_7632-2048x1365.jpg",
      "/images/houses/house-2/IMG_7655-2048x1365.jpg",
      "/images/houses/house-2/IMG_7661-2048x1365.jpg",
      "/images/houses/house-2/IMG_7665-2048x1365.jpg",
      "/images/houses/house-2/IMG_7669-2048x1365.jpg",
      "/images/houses/house-2/IMG_7673-2048x1365.jpg",
      "/images/houses/house-2/IMG_7674-2048x1365.jpg",
      "/images/houses/house-2/WhatsApp-Image-2025-07-01-at-15.47.24_741aff7b.jpg",
      "/images/houses/house-2/WhatsApp-Image-2025-07-01-at-15.47.30_8356dbf2.jpg",
    ],
  },
  {
    id: "house-3",
    name: { BG: "Къща 3", EN: "House 3" },
    capacity: { BG: "1-9 гости", EN: "1-9 guests" },
    description: {
      BG: "Просторно разпределение с плавен преход между дневна, спални и спокойна SPA атмосфера.",
      EN: "A spacious layout with a smooth flow between lounge, bedrooms, and a calm SPA atmosphere.",
    },
    price: { BG: "от 560 лв.", EN: "from 560 BGN" },
    details: {
      BG: ["Апартаментен тип", "Джакузи", "Open-plan всекидневна", "Планинска гледка"],
      EN: ["Apartment-style layout", "Jacuzzi", "Open-plan living area", "Mountain view"],
    },
    coverImage: "/images/houses/house-3/IMG_7579-1-2048x1365.jpg",
    imagePaths: [
      "/images/houses/house-3/IMG_7579-1-2048x1365.jpg",
      "/images/houses/house-3/IMG_7679-2048x1365.jpg",
      "/images/houses/house-3/IMG_7684-2048x1365.jpg",
      "/images/houses/house-3/IMG_7689-2048x1365.jpg",
      "/images/houses/house-3/IMG_7692-1-2048x1365.jpg",
      "/images/houses/house-3/IMG_7697-scaled.jpg",
      "/images/houses/house-3/IMG_7702-2048x1365.jpg",
      "/images/houses/house-3/IMG_7705-scaled.jpg",
      "/images/houses/house-3/IMG_7708-2048x1365.jpg",
      "/images/houses/house-3/IMG_7710-scaled.jpg",
      "/images/houses/house-3/IMG_7714-2048x1365.jpg",
      "/images/houses/house-3/IMG_7718-2048x1365.jpg",
      "/images/houses/house-3/IMG_7721-scaled.jpg",
      "/images/houses/house-3/IMG_7729-scaled.jpg",
      "/images/houses/house-3/IMG_7732-2048x1365.jpg",
      "/images/houses/house-3/IMG_7744-2048x1365.jpg",
      "/images/houses/house-3/WhatsApp-Image-2025-07-01-at-15.47.24_aba90dae.jpg",
      "/images/houses/house-3/WhatsApp-Image-2025-07-01-at-15.47.38_43d36a0b.jpg",
    ],
  },
  {
    id: "house-4",
    name: { BG: "Къща 4", EN: "House 4" },
    capacity: { BG: "1-11 гости", EN: "1-11 guests" },
    description: {
      BG: "Подходяща за по-големи компании, тази къща съчетава повече пространство, широка веранда и удобства за дълъг престой.",
      EN: "Ideal for larger groups, this house combines extra space, a wide veranda, and comfort for longer stays.",
    },
    price: { BG: "от 620 лв.", EN: "from 620 BGN" },
    details: {
      BG: ["2 етажа", "Широка веранда", "Джакузи", "Подходяща за компании"],
      EN: ["2 floors", "Wide veranda", "Jacuzzi", "Great for groups"],
    },
    coverImage: "/images/houses/house-4/1902dfa9c263ad848cf3ed11f60b2a29_31.jpeg.jpeg",
    imagePaths: [
      "/images/houses/house-4/1902dfa9c263ad848cf3ed11f60b2a29_31.jpeg.jpeg",
      "/images/houses/house-4/2.jpg",
      "/images/houses/house-4/663322.jpg",
      "/images/houses/house-4/99.jpg",
      "/images/houses/house-4/IMG-50e901a515a4b7187bb5c882572cd7cb-V-1.jpg",
    ],
  },
];

const legacyPathPattern = /\/images\/houses\/house-\d\/(cover\.jpg|gallery-\d+\.jpg)$/;

export function normalizeHouseRecord(house: HouseRecord): HouseRecord {
  const fallbackHouse = defaultHouses.find((item) => item.id === house.id) ?? house;
  const fallbackImages = fallbackHouse.imagePaths.filter(Boolean);
  const incomingImages = house.imagePaths.filter(Boolean);
  const hasLegacyOnlyImages =
    incomingImages.length > 0 &&
    incomingImages.every(
      (imagePath) => imagePath.startsWith("data:image") || legacyPathPattern.test(imagePath),
    );

  const resolvedImages =
    incomingImages.length === 0 || hasLegacyOnlyImages ? fallbackImages : incomingImages;
  const coverExists = resolvedImages.includes(house.coverImage);
  const coverIsLegacy = legacyPathPattern.test(house.coverImage);

  return {
    ...house,
    imagePaths: resolvedImages,
    coverImage:
      !house.coverImage || coverIsLegacy || !coverExists
        ? resolvedImages[0] ?? fallbackHouse.coverImage
        : house.coverImage,
  };
}

export const defaultAmenities: AmenityRecord[] = [
  {
    id: "jacuzzi",
    title: { BG: "Целогодишно Градинско Джакузи", EN: "Year-Round Garden Jacuzzi" },
    description: {
      BG: "7-местно джакузи с топла вода и гледка към боровете, създадено за снежни утрини и звездни вечери.",
      EN: "A 7-seat jacuzzi with warm water and pine forest views, designed for snowy mornings and starry evenings.",
    },
    image: "/images/pool/00.jpg",
  },
  {
    id: "pool",
    title: { BG: "Сезонен Басейн", EN: "Seasonal Pool" },
    description: {
      BG: "Летен акцент с релакс шезлонги, прохлада и светлина, който превръща следобеда в мини курорт.",
      EN: "A summer highlight with loungers, cool water, and light that turns the afternoon into a mini resort.",
    },
    image: "/images/pool/223344.jpg",
  },
  {
    id: "kids",
    title: { BG: "Детски Рай", EN: "Kids' Paradise" },
    description: {
      BG: "Пространство за игра и спокойствие за родителите, с удобства за детски забавления на открито.",
      EN: "A play-friendly zone that keeps children entertained and gives parents more room to relax.",
    },
    image: "/images/pool/unnamed-file-1.jpg",
  },
  {
    id: "barbecue",
    title: { BG: "Барбекю и Алпинеум", EN: "Barbecue and Alpine Garden" },
    description: {
      BG: "Място за бавни вечери, аромат на жар и стилно озеленена алпийска градина.",
      EN: "A place for slow evenings, glowing embers, and a beautifully landscaped alpine garden.",
    },
    image: "/images/pool/7788.jpg",
  },
];

export function normalizeAmenityRecord(amenity: AmenityRecord): AmenityRecord {
  const fallbackAmenity = defaultAmenities.find((item) => item.id === amenity.id) ?? amenity;

  return {
    ...fallbackAmenity,
    ...amenity,
    title: {
      ...fallbackAmenity.title,
      ...amenity.title,
    },
    description: {
      ...fallbackAmenity.description,
      ...amenity.description,
    },
    image: amenity.image || fallbackAmenity.image,
  };
}

export const offers: OfferRecord[] = [
  {
    title: { BG: "Коледа", EN: "Christmas" },
    badge: { BG: "Топ Оферта", EN: "Top Offer" },
    price: { BG: "от 1 390 лв.", EN: "from 1,390 BGN" },
    details: {
      BG: "3 нощувки, празнична декорация, welcome set и късен check-out според наличността.",
      EN: "3 nights, festive decoration, welcome set, and late check-out subject to availability.",
    },
  },
  {
    title: { BG: "Нова Година", EN: "New Year" },
    badge: { BG: "Сигничър", EN: "Signature" },
    price: { BG: "от 2 990 лв.", EN: "from 2,990 BGN" },
    details: {
      BG: "Премиум пакет с минимален престой, празнично осветление и приоритетно съдействие.",
      EN: "A premium package with minimum stay, festive lighting, and priority assistance.",
    },
  },
  {
    title: { BG: "Уикенд в Родопите", EN: "Weekend in the Rhodope Mountains" },
    badge: { BG: "Най-добра Стойност", EN: "Best Value" },
    price: { BG: "от 590 лв.", EN: "from 590 BGN" },
    details: {
      BG: "2 нощувки и персонализирана оферта според броя гости и сезона.",
      EN: "2 nights and a tailored offer based on the group size and season.",
    },
  },
];

export const pricingFaq: FaqRecord[] = [
  {
    question: {
      BG: "Как се формира цената за всяка къща?",
      EN: "How is the price for each house calculated?",
    },
    answer: {
      BG: "Цената зависи от избраната къща, периода, броя нощувки и броя гости. За празнични периоди подготвяме индивидуална оферта.",
      EN: "Pricing depends on the selected house, period, number of nights, and guest count. For holidays we prepare a tailored offer.",
    },
  },
  {
    question: {
      BG: "Каква е политиката за капаро?",
      EN: "What is your deposit policy?",
    },
    answer: {
      BG: "Резервацията се потвърждава с авансово плащане. Остатъкът се урежда преди настаняване или в деня на пристигане.",
      EN: "Bookings are confirmed with an advance payment. The remaining balance is settled before check-in or on arrival day.",
    },
  },
  {
    question: {
      BG: "Предлагате ли персонални оферти за групи?",
      EN: "Do you offer tailored group packages?",
    },
    answer: {
      BG: "Да. Можем да комбинираме няколко къщи, late check-out и допълнителни услуги за семейни и корпоративни събития.",
      EN: "Yes. We can combine several houses, late check-out, and extra services for family and corporate events.",
    },
  },
];

export const defaultAvailabilityEntries: AvailabilityEntry[] = [
  { id: "availability-1", houseId: "house-1", date: "2026-03-20", status: "reserved", guests: 6 },
  { id: "availability-2", houseId: "house-2", date: "2026-03-20", status: "available", guests: 0 },
  { id: "availability-3", houseId: "house-3", date: "2026-03-20", status: "occupied", guests: 8 },
  { id: "availability-4", houseId: "house-4", date: "2026-03-20", status: "available", guests: 0 },
];

export const defaultInquiries: InquiryRecord[] = [];

function parseInquiryImageValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => parseInquiryImageValue(item));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[")) {
      try {
        return parseInquiryImageValue(JSON.parse(trimmed));
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return [
      ...parseInquiryImageValue(record.path),
      ...parseInquiryImageValue(record.url),
      ...parseInquiryImageValue(record.src),
      ...parseInquiryImageValue(record.publicUrl),
      ...parseInquiryImageValue(record.public_url),
      ...parseInquiryImageValue(record.name),
    ];
  }

  return [];
}

function getInquiryImagePaths(inquiry: Record<string, unknown>) {
  const resolvedPaths = [
    inquiry.imagePaths,
    inquiry.images,
    inquiry.photos,
    inquiry.attachments,
    inquiry.image,
    inquiry.image_path,
    inquiry.image_url,
    inquiry.image_urls,
    inquiry.photo_url,
    inquiry.photo_urls,
    inquiry.attachment,
    inquiry.attachment_url,
    inquiry.attachment_urls,
  ].flatMap((value) => parseInquiryImageValue(value));

  return Array.from(new Set(resolvedPaths.filter(Boolean)));
}

export function normalizeInquiryRecord(
  inquiry: Partial<InquiryRecord> & Record<string, unknown> & { id: string; reviewed?: boolean },
): InquiryRecord {
  return {
    id: inquiry.id,
    firstName: inquiry.firstName ?? "",
    lastName: inquiry.lastName ?? "",
    phone: inquiry.phone ?? "",
    email: inquiry.email ?? "",
    houseId: inquiry.houseId ?? "house-1",
    guests: inquiry.guests ?? 1,
    checkIn: inquiry.checkIn ?? "",
    checkOut: inquiry.checkOut ?? "",
    message: inquiry.message ?? "",
    status: inquiry.status ?? (inquiry.reviewed ? "deposit_paid" : "new"),
    adminNotes: inquiry.adminNotes ?? "",
    createdAt:
      inquiry.createdAt ??
      (typeof inquiry.created_at === "string" ? inquiry.created_at : new Date().toISOString()),
    imagePaths: getInquiryImagePaths(inquiry),
  };
}

export function getInquiryStatusMeta(language: LanguageCode, status: InquiryStatus) {
  const labels = {
    BG: {
      new: "Нова",
      pending_deposit: "Очаква капаро",
      deposit_paid: "Капарирана/Запазена",
      cancelled: "Отказ",
    },
    EN: {
      new: "New",
      pending_deposit: "Pending Deposit",
      deposit_paid: "Deposit Paid",
      cancelled: "Cancelled",
    },
  };

  const tones = {
    new: "border-sky-400/25 bg-sky-400/15 text-sky-100",
    pending_deposit: "border-amber-400/25 bg-amber-400/15 text-amber-100",
    deposit_paid: "border-emerald-400/25 bg-emerald-400/15 text-emerald-100",
    cancelled: "border-stone-400/20 bg-stone-400/10 text-stone-200",
  } satisfies Record<InquiryStatus, string>;

  const dots = {
    new: "bg-sky-300",
    pending_deposit: "bg-amber-300",
    deposit_paid: "bg-emerald-300",
    cancelled: "bg-stone-300",
  } satisfies Record<InquiryStatus, string>;

  return {
    label: labels[language][status],
    tone: tones[status],
    dot: dots[status],
  };
}

export const guestOptions = Array.from({ length: 15 }, (_, index) => index + 1);

export const siteCopy = {
  BG: {
    languageSwitch: "BG",
    navigation: [
      { href: "#home", label: "Начало" },
      { href: "#houses", label: "Къщи" },
      { href: "#amenities", label: "Удобства" },
      { href: "#offers", label: "Оферти" },
      { href: "#contact", label: "Контакти" },
    ],
    navbar: {
      brandTop: "Къщи за гости",
      brandBottom: "Vili Ilievi",
      reserve: "Резервирай",
    },
    hero: {
      badge: "Луксозно планинско уединение в Цигов Чарк",
      headline: "Изживейте магията на Родопите.",
      description:
        "Къщи за гости Вили Илиеви е вашето място за почивка сред боровете, с панорамни гледки, топли вечери и spa моменти.",
      primaryCta: "Разгледай къщите",
      location: "Цигов Чарк, България",
      heroAlt: "Панорамна гледка към комплекса",
      poolAlt: "Басейн и зона за релакс",
      detailAlt: "Детайл от комплекса",
    },
    booking: {
      checkIn: "Настаняване",
      checkOut: "Напускане",
      guests: "Гости",
      selectDate: "Изберете дата",
      selectGuests: "Изберете гости",
      adults: "Възрастни",
      children: "Деца",
      availability: "Провери наличност",
      summaryReady: "Изборът е записан. Вижте конзолата за demo payload.",
      selectDatesHint: "Изберете период",
      guestsValue: (count: number) => `${count} гости`,
    },
    houses: {
      sectionLabel: "Нашите Къщи",
      heading: "Четири планински резиденции със собствен характер и ритъм.",
      description:
        "Всяка къща е създадена като отделно преживяване: панорамни веранди, spa удобства и спокойствие за дълги вечери.",
      signatureStay: "Signature stay",
      explore: "Разгледай в детайли",
      galleryLabel: "Галерия",
      priceLabel: "Цена",
      previousImage: "Предишно изображение",
      nextImage: "Следващо изображение",
      showImage: (index: number) => `Покажи изображение ${index}`,
    },
    amenities: {
      sectionLabel: "Удобства и Релакс",
      heading: "Преживявания, които превръщат уикенда в лично планинско убежище.",
    },
    offers: {
      sectionLabel: "Оферти 2025-2026",
      heading: "Гъвкави пакети за празници, романтични бягства и силни уикенди в планината.",
    },
    contact: {
      sectionLabel: "Свържете се с нас",
      heading: "Изпратете запитване и ще върнем персонална оферта.",
      fields: {
        name: "Име",
        email: "Имейл",
        dates: "Дати",
        message: "Съобщение",
      },
      submit: "Изпрати запитване",
      success: "Запитването е изпратено като demo UI. Свържете бекенд или Supabase, за да запазвате реални резервации.",
      phone: "Телефон",
      location: "Локация",
      locationValue: "Цигов Чарк, България",
    },
    footer: {
      rights: "Всички права запазени.",
      offers: "Оферти",
      contacts: "Контакти",
      accommodation: "Настаняване",
    },
    weather: {
      label: "Цигов Чарк",
      loading: "Зареждане...",
    },
    admin: {
      title: "Админ Панел",
      subtitle: "Локално demo управление на съдържанието и заетостта.",
      loginTitle: "Вход за администратор",
      loginHint: "Използва mock удостоверяване и локално съхранение чрез Zustand persist.",
      username: "Потребител",
      password: "Парола",
      login: "Вход",
      logout: "Изход",
      houses: "Вили",
      availability: "Заетост",
      content: "Съдържание",
      save: "Запази",
      addImage: "Добави изображение",
      delete: "Изтрий",
      setCover: "Задай като корица",
      cover: "Корица",
      imagePath: "Път до изображение",
      descriptionBg: "Описание BG",
      descriptionEn: "Описание EN",
      priceBg: "Цена BG",
      priceEn: "Цена EN",
      detailsBg: "Детайли BG",
      detailsEn: "Детайли EN",
      availabilityTitle: "Таблица със заетост",
      date: "Дата",
      status: "Статус",
      guests: "Гости",
      addRow: "Добави запис",
      available: "Свободна",
      reserved: "Резервирана",
      occupied: "Заета",
      credentialsHint: "Demo вход: admin / vili123",
    },
  },
  EN: {
    languageSwitch: "EN",
    navigation: [
      { href: "#home", label: "Home" },
      { href: "#houses", label: "Houses" },
      { href: "#amenities", label: "Amenities" },
      { href: "#offers", label: "Offers" },
      { href: "#contact", label: "Contact" },
    ],
    navbar: {
      brandTop: "Guest Houses",
      brandBottom: "Vili Ilievi",
      reserve: "Reserve",
    },
    hero: {
      badge: "Luxury mountain retreat in Tsigov Chark",
      headline: "Experience the magic of the Rhodopes.",
      description:
        "Vili Ilievi Guest Houses is your place to unwind among the pines, with panoramic views, warm evenings, and spa moments.",
      primaryCta: "Explore the houses",
      location: "Tsigov Chark, Bulgaria",
      heroAlt: "Panoramic view of the property",
      poolAlt: "Pool and relaxation area",
      detailAlt: "Property detail view",
    },
    booking: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      selectDate: "Select a date",
      selectGuests: "Select guests",
      adults: "Adults",
      children: "Children",
      availability: "Check availability",
      summaryReady: "Selection saved. See the console for the demo payload.",
      selectDatesHint: "Select a stay",
      guestsValue: (count: number) => `${count} guests`,
    },
    houses: {
      sectionLabel: "Our Houses",
      heading: "Four mountain residences with their own character and rhythm.",
      description:
        "Each house is designed as a distinct experience: panoramic verandas, spa comforts, and calm for long evenings.",
      signatureStay: "Signature stay",
      explore: "Explore in detail",
      galleryLabel: "Gallery",
      priceLabel: "Price",
      previousImage: "Previous image",
      nextImage: "Next image",
      showImage: (index: number) => `Show image ${index}`,
    },
    amenities: {
      sectionLabel: "Amenities and Relaxation",
      heading: "Experiences that turn a weekend into a personal mountain hideaway.",
    },
    offers: {
      sectionLabel: "Offers 2025-2026",
      heading: "Flexible packages for holidays, romantic escapes, and memorable mountain weekends.",
    },
    contact: {
      sectionLabel: "Get in touch",
      heading: "Send an enquiry and we will return a tailored offer.",
      fields: {
        name: "Name",
        email: "Email",
        dates: "Dates",
        message: "Message",
      },
      submit: "Send enquiry",
      success: "The enquiry was submitted as a demo UI. Connect a backend or Supabase to store real bookings.",
      phone: "Phone",
      location: "Location",
      locationValue: "Tsigov Chark, Bulgaria",
    },
    footer: {
      rights: "All rights reserved.",
      offers: "Offers",
      contacts: "Contact",
      accommodation: "Accommodation",
    },
    weather: {
      label: "Tsigov Chark",
      loading: "Loading...",
    },
    admin: {
      title: "Admin Panel",
      subtitle: "Local demo management for content and availability.",
      loginTitle: "Administrator Login",
      loginHint: "Uses mock authentication and local persistence via Zustand persist.",
      username: "Username",
      password: "Password",
      login: "Log in",
      logout: "Log out",
      houses: "Houses",
      availability: "Availability",
      content: "Content",
      save: "Save",
      addImage: "Add image",
      delete: "Delete",
      setCover: "Set as cover",
      cover: "Cover",
      imagePath: "Image path",
      descriptionBg: "Description BG",
      descriptionEn: "Description EN",
      priceBg: "Price BG",
      priceEn: "Price EN",
      detailsBg: "Details BG",
      detailsEn: "Details EN",
      availabilityTitle: "Availability table",
      date: "Date",
      status: "Status",
      guests: "Guests",
      addRow: "Add row",
      available: "Available",
      reserved: "Reserved",
      occupied: "Occupied",
      credentialsHint: "Demo login: admin / vili123",
    },
  },
} satisfies Record<LanguageCode, unknown>;

export function getStatusLabel(language: LanguageCode, status: AvailabilityStatus) {
  const labels = {
    BG: {
      available: "Свободна",
      reserved: "Резервирана",
      occupied: "Заета",
    },
    EN: {
      available: "Available",
      reserved: "Reserved",
      occupied: "Occupied",
    },
  };

  return labels[language][status];
}

export const defaultHeroContent = {
  heroTitle: siteCopy.BG.hero.headline,
  heroSubtitle: siteCopy.BG.hero.description,
  heroBackgroundImage: heroImages.main[0] ?? heroImages.pool[0] ?? "",
};
