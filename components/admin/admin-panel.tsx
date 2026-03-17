"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, LogOut, PencilLine, ShieldCheck, Trash2, X } from "lucide-react";

import { DatePickerInput } from "@/components/date-picker-input";
import { useSiteCopy } from "@/hooks/use-site-copy";
import {
  getInquiryStatusMeta,
  getStatusLabel,
  type AmenityRecord,
  type AvailabilityEntry,
  type AvailabilityStatus,
  type InquiryRecord,
  type InquiryStatus,
} from "@/lib/site-data";
import { cn, formatDisplayDate } from "@/lib/utils";
import { useAdminStore } from "@/stores/admin-store";

function createAvailabilityEntry(houseId: string): AvailabilityEntry {
  return {
    id: `availability-${Date.now()}`,
    houseId,
    date: new Date().toISOString().slice(0, 10),
    status: "available",
    guests: 0,
  };
}

function createInquiryDraft(inquiry: InquiryRecord) {
  return {
    firstName: inquiry.firstName,
    lastName: inquiry.lastName,
    phone: inquiry.phone,
    email: inquiry.email,
    houseId: inquiry.houseId,
    guests: String(inquiry.guests),
    checkIn: inquiry.checkIn,
    checkOut: inquiry.checkOut,
    message: inquiry.message,
    status: inquiry.status,
    adminNotes: inquiry.adminNotes,
  };
}

function createAmenityDraft(amenity: AmenityRecord) {
  return {
    title: { ...amenity.title },
    description: { ...amenity.description },
    image: amenity.image,
  };
}

const inquiryStatusOrder: InquiryStatus[] = ["new", "pending_deposit", "deposit_paid", "cancelled"];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function resolveInquiryImageUrl(imagePath: string) {
  const trimmedPath = imagePath.trim();

  if (!trimmedPath) {
    return null;
  }

  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://") ||
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("blob:") ||
    trimmedPath.startsWith("/")
  ) {
    return trimmedPath;
  }

  if (!supabaseUrl) {
    return null;
  }

  const normalizedBaseUrl = supabaseUrl.replace(/\/$/, "");
  const normalizedPath = trimmedPath.replace(/^\/+/, "");

  if (normalizedPath.startsWith("storage/v1/object/public/")) {
    return `${normalizedBaseUrl}/${normalizedPath}`;
  }

  return `${normalizedBaseUrl}/storage/v1/object/public/${normalizedPath}`;
}

export function AdminPanel() {
  const { language, copy } = useSiteCopy();
  const heroTitle = useAdminStore((state) => state.heroTitle);
  const heroSubtitle = useAdminStore((state) => state.heroSubtitle);
  const heroBackgroundImage = useAdminStore((state) => state.heroBackgroundImage);
  const houses = useAdminStore((state) => state.houses);
  const amenities = useAdminStore((state) => state.amenities);
  const availability = useAdminStore((state) => state.availability);
  const inquiries = useAdminStore((state) => state.inquiries);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const login = useAdminStore((state) => state.login);
  const logout = useAdminStore((state) => state.logout);
  const loginError = useAdminStore((state) => state.loginError);
  const setHeroTitle = useAdminStore((state) => state.setHeroTitle);
  const setHeroSubtitle = useAdminStore((state) => state.setHeroSubtitle);
  const setHeroBackgroundImage = useAdminStore((state) => state.setHeroBackgroundImage);
  const saveHouse = useAdminStore((state) => state.saveHouse);
  const addHouseImage = useAdminStore((state) => state.addHouseImage);
  const deleteHouseImage = useAdminStore((state) => state.deleteHouseImage);
  const setCoverImage = useAdminStore((state) => state.setCoverImage);
  const updateAmenity = useAdminStore((state) => state.updateAmenity);
  const upsertAvailability = useAdminStore((state) => state.upsertAvailability);
  const deleteAvailability = useAdminStore((state) => state.deleteAvailability);
  const updateInquiry = useAdminStore((state) => state.updateInquiry);
  const updateInquiryStatus = useAdminStore((state) => state.updateInquiryStatus);
  const deleteInquiry = useAdminStore((state) => state.deleteInquiry);

  const [section, setSection] = useState<"hero" | "houses" | "amenities" | "availability" | "inquiries">("houses");
  const [selectedHouseId, setSelectedHouseId] = useState(houses[0]?.id ?? "");
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [statusRequestError, setStatusRequestError] = useState<string | null>(null);
  const [draftInquiry, setDraftInquiry] = useState<ReturnType<typeof createInquiryDraft> | null>(null);
  const [amenityDrafts, setAmenityDrafts] = useState<Record<string, ReturnType<typeof createAmenityDraft>>>({});

  useEffect(() => {
    if (!selectedHouseId && houses[0]) {
      setSelectedHouseId(houses[0].id);
    }
  }, [houses, selectedHouseId]);

  const activeHouse = houses.find((house) => house.id === selectedHouseId) ?? houses[0] ?? null;
  const sortedInquiries = useMemo(
    () =>
      [...inquiries].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [inquiries],
  );
  const selectedInquiry = sortedInquiries.find((inquiry) => inquiry.id === selectedInquiryId) ?? null;
  const selectedInquiryImages = useMemo(
    () =>
      (selectedInquiry?.imagePaths ?? [])
        .map((imagePath, index) => ({
          id: `${selectedInquiry?.id ?? "inquiry"}-${index}`,
          imagePath,
          imageUrl: resolveInquiryImageUrl(imagePath),
        }))
        .filter((image) => image.imageUrl),
    [selectedInquiry],
  );

  useEffect(() => {
    setDraftInquiry(selectedInquiry ? createInquiryDraft(selectedInquiry) : null);
  }, [selectedInquiry]);

  useEffect(() => {
    setAmenityDrafts((current) => {
      const nextDrafts = { ...current };

      for (const amenity of amenities) {
        if (!nextDrafts[amenity.id]) {
          nextDrafts[amenity.id] = createAmenityDraft(amenity);
        }
      }

      return nextDrafts;
    });
  }, [amenities]);

  const adminLabels = useMemo(
    () =>
      language === "BG"
        ? {
            inquiries: "Заявки",
            edit: "Редактирай",
            guest: "Гост",
            stay: "Престой",
            house: "Къща",
            status: "Статус",
            received: "Получена",
            actions: "Действия",
            totalInquiries: "Общо заявки",
            noInquiries: "Все още няма получени заявки.",
            inquiryHint: "Премиум изглед за управление на заявки с локално Zustand persistence.",
            inquiryDetails: "Детайли по заявка",
            closeEditor: "Затвори редактора",
            quickActions: "Бързи действия",
            firstName: "Име",
            lastName: "Фамилия",
            phone: "Телефон",
            guestsCount: "Гости",
            message: "Съобщение",
            notes: "Бележки (Само за администратор)",
            cancel: "Отказ",
            saveChanges: "Запази промените",
            amenities: "Удобства",
            amenitiesTitle: "Удобства и Релакс",
            amenitiesHint: "Редактирайте заглавие, описание и снимка за всяко удобство.",
            titleBg: "Заглавие BG",
            titleEn: "Заглавие EN",
            imageUpdated: "Изображението е обновено.",
            imageMissing: "Няма качена снимка.",
            imagePreview: "Преглед на снимка",
          }
        : {
            inquiries: "Inquiries",
            edit: "Edit",
            guest: "Guest",
            stay: "Stay",
            house: "House",
            status: "Status",
            received: "Received",
            actions: "Actions",
            totalInquiries: "Total inquiries",
            noInquiries: "There are no inquiries yet.",
            inquiryHint: "Premium inquiry management view powered by local Zustand persistence.",
            inquiryDetails: "Inquiry details",
            closeEditor: "Close editor",
            quickActions: "Quick actions",
            firstName: "First name",
            lastName: "Last name",
            phone: "Phone",
            guestsCount: "Guests",
            message: "Message",
            notes: "Notes (Admin only)",
            cancel: "Cancel",
            saveChanges: "Save changes",
            amenities: "Amenities",
            amenitiesTitle: "Amenities and Relaxation",
            amenitiesHint: "Edit the title, description, and image for each amenity.",
            titleBg: "Title BG",
            titleEn: "Title EN",
            imageUpdated: "Image updated successfully.",
            imageMissing: "No uploaded image yet.",
            imagePreview: "Image preview",
          },
    [language],
  );

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(username, password);
  };

  const updateActiveHouse = (updater: typeof activeHouse) => {
    if (updater) {
      saveHouse(updater);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !activeHouse) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        addHouseImage(activeHouse.id, reader.result);
        setUploadFeedback(language === "BG" ? "Изображението е добавено." : "Image added successfully.");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleHeroImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHeroBackgroundImage(reader.result);
        setUploadFeedback(language === "BG" ? "Изображението на началния екран е обновено." : "Hero image updated successfully.");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const updateAmenityDraftField = (
    amenity: AmenityRecord,
    field: "title" | "description",
    locale: "BG" | "EN",
    value: string,
  ) => {
    setAmenityDrafts((current) => ({
      ...current,
      [amenity.id]: {
        ...(current[amenity.id] ?? createAmenityDraft(amenity)),
        [field]: {
          ...(current[amenity.id]?.[field] ?? amenity[field]),
          [locale]: value,
        },
      },
    }));
  };

  const handleAmenityImageUpload = (amenity: AmenityRecord, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;

      if (typeof image === "string") {
        setAmenityDrafts((current) => ({
          ...current,
          [amenity.id]: {
            ...(current[amenity.id] ?? createAmenityDraft(amenity)),
            image,
          },
        }));
        setUploadFeedback(adminLabels.imageUpdated);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const saveAmenityDraft = (amenityId: string) => {
    const draft = amenityDrafts[amenityId];

    if (!draft) {
      return;
    }

    updateAmenity(amenityId, draft);
    setUploadFeedback(null);
  };

  const closeInquiryDrawer = () => {
    setSelectedInquiryId(null);
    setDraftInquiry(null);
    setStatusRequestError(null);
  };

  const handleInquiryStatusChange = async (status: InquiryStatus) => {
    if (!selectedInquiry) {
      return;
    }

    setStatusRequestError(null);

    const house = houses.find((item) => item.id === selectedInquiry.houseId);

    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          email: selectedInquiry.email,
          firstName: selectedInquiry.firstName,
          lastName: selectedInquiry.lastName,
          houseName: house?.name[language] ?? selectedInquiry.houseId,
          checkIn: selectedInquiry.checkIn,
          checkOut: selectedInquiry.checkOut,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatusRequestError(result.error ?? (language === "BG" ? "Статусът не можа да бъде обновен." : "The reservation status could not be updated."));
        return;
      }

      setDraftInquiry((current) => current ? { ...current, status } : current);
      updateInquiryStatus(selectedInquiry.id, status);
    } catch {
      setStatusRequestError(language === "BG" ? "Статусът не можа да бъде обновен." : "The reservation status could not be updated.");
    }
  };

  const saveInquiryDraft = () => {
    if (!selectedInquiry || !draftInquiry) {
      return;
    }

    updateInquiry(selectedInquiry.id, {
      firstName: draftInquiry.firstName,
      lastName: draftInquiry.lastName,
      phone: draftInquiry.phone,
      email: draftInquiry.email,
      houseId: draftInquiry.houseId,
      guests: Number(draftInquiry.guests) || 1,
      checkIn: draftInquiry.checkIn,
      checkOut: draftInquiry.checkOut,
      message: draftInquiry.message,
      status: draftInquiry.status,
      adminNotes: draftInquiry.adminNotes,
    });

    closeInquiryDrawer();
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[rgb(var(--background))] px-4 py-10">
        <div className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glow">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bronze-300/20 text-bronze-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl text-stone-50">{copy.admin.loginTitle}</h1>
              <p className="mt-1 text-sm text-stone-100/60">{copy.admin.loginHint}</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-stone-100/50">{copy.admin.username}</span>
              <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-stone-50 outline-none" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-stone-100/50">{copy.admin.password}</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-stone-50 outline-none" />
            </label>
            <button className="cta-ring w-full rounded-2xl px-[1px] py-[1px]">
              <span className="block rounded-2xl bg-stone-50 px-5 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-forest-950">
                {copy.admin.login}
              </span>
            </button>
          </form>
          <p className="mt-4 text-sm text-stone-100/55">{copy.admin.credentialsHint}</p>
          {loginError ? <p className="mt-2 text-sm text-red-300">{loginError}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[rgb(var(--background))] px-4 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-bronze-300">{copy.admin.title}</p>
              <h1 className="mt-3 text-3xl text-stone-50">{copy.admin.subtitle}</h1>
            </div>
            <div className="space-y-3">
              <button type="button" onClick={() => setSection("hero")} className={cn("w-full rounded-2xl px-4 py-3 text-left text-sm transition", section === "hero" ? "bg-white/10 text-stone-50" : "bg-black/10 text-stone-100/70")}>{language === "BG" ? "Начален екран" : "Hero Section"}</button>
              <button type="button" onClick={() => setSection("houses")} className={cn("w-full rounded-2xl px-4 py-3 text-left text-sm transition", section === "houses" ? "bg-white/10 text-stone-50" : "bg-black/10 text-stone-100/70")}>{copy.admin.houses}</button>
              <button type="button" onClick={() => setSection("amenities")} className={cn("w-full rounded-2xl px-4 py-3 text-left text-sm transition", section === "amenities" ? "bg-white/10 text-stone-50" : "bg-black/10 text-stone-100/70")}>{adminLabels.amenities}</button>
              <button type="button" onClick={() => setSection("availability")} className={cn("w-full rounded-2xl px-4 py-3 text-left text-sm transition", section === "availability" ? "bg-white/10 text-stone-50" : "bg-black/10 text-stone-100/70")}>{copy.admin.availability}</button>
              <button type="button" onClick={() => setSection("inquiries")} className={cn("w-full rounded-2xl px-4 py-3 text-left text-sm transition", section === "inquiries" ? "bg-white/10 text-stone-50" : "bg-black/10 text-stone-100/70")}>{language === "BG" ? "Заявки" : "Inquiries"}</button>
            </div>
            <button type="button" onClick={logout} className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-100/80">
              <LogOut className="h-4 w-4" />
              {copy.admin.logout}
            </button>
          </aside>

          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8">
            {section === "hero" ? (
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-white/10 bg-black/15 p-5">
                    <h2 className="text-3xl text-stone-50">{language === "BG" ? "Начален екран" : "Hero Section"}</h2>
                    <p className="mt-2 text-sm text-stone-100/60">
                      {language === "BG"
                        ? "Редактирайте заглавието, подзаглавието и фонoвото изображение на началната секция."
                        : "Edit the title, subtitle, and background image for the homepage hero."}
                    </p>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Hero Title" : "Hero Title"}</span>
                    <input
                      value={heroTitle}
                      onChange={(event) => setHeroTitle(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Hero Subtitle" : "Hero Subtitle"}</span>
                    <textarea
                      rows={6}
                      value={heroSubtitle}
                      onChange={(event) => setHeroSubtitle(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none"
                    />
                  </label>

                  <div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-forest-950">
                      <ImagePlus className="h-4 w-4" />
                      {language === "BG" ? "Качи фонова снимка" : "Upload background image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                    </label>
                    {uploadFeedback ? <p className="mt-3 text-sm text-accent-soft">{uploadFeedback}</p> : null}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-bronze-300">{language === "BG" ? "Преглед" : "Preview"}</p>
                  <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                    <div className="relative aspect-[4/5] overflow-hidden bg-black/30">
                      <Image
                        src={heroBackgroundImage}
                        alt={heroTitle || "Hero background"}
                        fill
                        sizes="(max-width: 1280px) 100vw, 420px"
                        className="object-cover"
                        unoptimized={heroBackgroundImage.startsWith("data:")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-forest-950/90" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="rounded-[22px] border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                          <p className="text-xs uppercase tracking-[0.28em] text-bronze-300">{copy.hero.badge}</p>
                          <h3 className="mt-3 text-2xl leading-tight text-stone-50">{heroTitle}</h3>
                          <p className="mt-3 text-sm leading-7 text-stone-100/78">{heroSubtitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-white/10 px-5 py-4 text-xs text-stone-100/55">
                      {heroBackgroundImage.startsWith("data:image") ? (language === "BG" ? "Качено локално изображение" : "Uploaded local image") : heroBackgroundImage}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {section === "houses" && activeHouse ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {houses.map((house) => (
                    <button
                      key={house.id}
                      type="button"
                      onClick={() => setSelectedHouseId(house.id)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm transition",
                        selectedHouseId === house.id ? "bg-bronze-300 text-forest-950" : "bg-white/10 text-stone-100/75",
                      )}
                    >
                      {house.name[language]}
                    </button>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-white/10 bg-black/15 p-5">
                      <h2 className="text-2xl text-stone-50">{activeHouse.name[language]}</h2>
                      <p className="mt-2 text-sm text-stone-100/60">{copy.admin.content}</p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.descriptionBg}</span>
                      <textarea rows={5} value={activeHouse.description.BG} onChange={(event) => updateActiveHouse({ ...activeHouse, description: { ...activeHouse.description, BG: event.target.value } })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.descriptionEn}</span>
                      <textarea rows={5} value={activeHouse.description.EN} onChange={(event) => updateActiveHouse({ ...activeHouse, description: { ...activeHouse.description, EN: event.target.value } })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.priceBg}</span>
                        <input value={activeHouse.price.BG} onChange={(event) => updateActiveHouse({ ...activeHouse, price: { ...activeHouse.price, BG: event.target.value } })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.priceEn}</span>
                        <input value={activeHouse.price.EN} onChange={(event) => updateActiveHouse({ ...activeHouse, price: { ...activeHouse.price, EN: event.target.value } })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.detailsBg}</span>
                        <textarea rows={6} value={activeHouse.details.BG.join("\n")} onChange={(event) => updateActiveHouse({ ...activeHouse, details: { ...activeHouse.details, BG: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.detailsEn}</span>
                        <textarea rows={6} value={activeHouse.details.EN.join("\n")} onChange={(event) => updateActiveHouse({ ...activeHouse, details: { ...activeHouse.details, EN: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) } })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-black/15 p-5">
                    <h3 className="text-xl text-stone-50">Image Gallery Manager</h3>
                    <p className="mt-2 text-sm text-stone-100/60">Uploaded files are stored as Base64 data URLs in persisted Zustand state for this demo.</p>
                    <div className="mt-4">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-forest-950">
                        <ImagePlus className="h-4 w-4" />
                        {copy.admin.addImage}
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                      {uploadFeedback ? <p className="mt-3 text-sm text-accent-soft">{uploadFeedback}</p> : null}
                    </div>

                    <div className="mt-5 space-y-3">
                      {activeHouse.imagePaths.map((imagePath) => (
                        <div key={imagePath} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              {imagePath.startsWith("data:image") ? <p className="text-sm text-stone-50">Uploaded local image</p> : <p className="break-all text-sm text-stone-50">{imagePath}</p>}
                              {activeHouse.coverImage === imagePath ? <span className="mt-2 inline-flex rounded-full bg-bronze-300 px-3 py-1 text-xs font-medium text-forest-950">{copy.admin.cover}</span> : null}
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setCoverImage(activeHouse.id, imagePath)} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-stone-50">{copy.admin.setCover}</button>
                              <button type="button" onClick={() => deleteHouseImage(activeHouse.id, imagePath)} className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">{copy.admin.delete}</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {section === "amenities" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl text-stone-50">{adminLabels.amenitiesTitle}</h2>
                  <p className="mt-2 text-sm text-stone-100/60">{adminLabels.amenitiesHint}</p>
                </div>

                <div className="space-y-6">
                  {amenities.map((amenity, index) => {
                    const draft = amenityDrafts[amenity.id] ?? createAmenityDraft(amenity);

                    return (
                      <div key={amenity.id} className="grid gap-6 rounded-[28px] border border-white/10 bg-black/15 p-5 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className={cn(index % 2 === 1 && "xl:order-2")}>
                          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-3">
                            <div className="aspect-[4/3] overflow-hidden rounded-[18px] bg-black/20">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={draft.image || amenity.image}
                                alt={draft.title[language] || amenity.title[language]}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">{adminLabels.imagePreview}</p>
                            <p className="mt-1 text-sm text-stone-100/60">
                              {draft.image ? adminLabels.imageUpdated : adminLabels.imageMissing}
                            </p>
                          </div>
                        </div>

                        <div className={cn("space-y-4", index % 2 === 1 && "xl:order-1")}>
                          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-bronze-300">#{index + 1}</p>
                            <h3 className="mt-2 text-2xl text-stone-50">{draft.title[language] || amenity.title[language]}</h3>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{adminLabels.titleBg}</span>
                              <input
                                value={draft.title.BG}
                                onChange={(event) => updateAmenityDraftField(amenity, "title", "BG", event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{adminLabels.titleEn}</span>
                              <input
                                value={draft.title.EN}
                                onChange={(event) => updateAmenityDraftField(amenity, "title", "EN", event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none"
                              />
                            </label>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.descriptionBg}</span>
                              <textarea
                                rows={5}
                                value={draft.description.BG}
                                onChange={(event) => updateAmenityDraftField(amenity, "description", "BG", event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{copy.admin.descriptionEn}</span>
                              <textarea
                                rows={5}
                                value={draft.description.EN}
                                onChange={(event) => updateAmenityDraftField(amenity, "description", "EN", event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none"
                              />
                            </label>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-forest-950">
                              <ImagePlus className="h-4 w-4" />
                              {copy.admin.addImage}
                              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleAmenityImageUpload(amenity, event)} />
                            </label>
                            <button
                              type="button"
                              onClick={() => saveAmenityDraft(amenity.id)}
                              className="rounded-2xl border border-bronze-300/40 bg-bronze-300 px-4 py-3 text-sm font-medium text-forest-950"
                            >
                              {adminLabels.saveChanges}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {section === "availability" ? (
              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl text-stone-50">{copy.admin.availabilityTitle}</h2>
                    <p className="mt-2 text-sm text-stone-100/60">Manual demo availability editing stored locally in the browser.</p>
                  </div>
                  <button type="button" onClick={() => upsertAvailability(createAvailabilityEntry(houses[0]?.id ?? "house-1"))} className="rounded-2xl bg-stone-50 px-4 py-3 text-sm font-medium text-forest-950">{copy.admin.addRow}</button>
                </div>
                <div className="overflow-x-auto rounded-[28px] border border-white/10">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/5 text-stone-100/60">
                      <tr>
                        <th className="px-4 py-3">{copy.admin.houses}</th>
                        <th className="px-4 py-3">{copy.admin.date}</th>
                        <th className="px-4 py-3">{copy.admin.status}</th>
                        <th className="px-4 py-3">{copy.admin.guests}</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {availability.map((entry) => (
                        <tr key={entry.id} className="border-t border-white/10">
                          <td className="px-4 py-3">
                            <select value={entry.houseId} onChange={(event) => upsertAvailability({ ...entry, houseId: event.target.value })} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-stone-50 outline-none">
                              {houses.map((house) => <option key={house.id} value={house.id}>{house.name[language]}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-2">
                              <input type="date" value={entry.date} onChange={(event) => upsertAvailability({ ...entry, date: event.target.value })} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-stone-50 outline-none" />
                              <p className="text-xs text-stone-100/55">{formatDisplayDate(entry.date)}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select value={entry.status} onChange={(event) => upsertAvailability({ ...entry, status: event.target.value as AvailabilityStatus })} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-stone-50 outline-none">
                              {(["available", "reserved", "occupied"] as AvailabilityStatus[]).map((status) => <option key={status} value={status}>{getStatusLabel(language, status)}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min={0} value={entry.guests} onChange={(event) => upsertAvailability({ ...entry, guests: Number(event.target.value) })} className="w-24 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-stone-50 outline-none" />
                          </td>
                          <td className="px-4 py-3">
                            <button type="button" onClick={() => deleteAvailability(entry.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">
                              <Trash2 className="h-4 w-4" />
                              {copy.admin.delete}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
            {section === "inquiries" ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl text-stone-50">{language === "BG" ? "Заявки" : "Inquiries"}</h2>
                    <p className="mt-2 text-sm text-stone-100/60">
                      {language === "BG"
                        ? "Премиум изглед за управление на заявки с локално Zustand persistence."
                        : "Premium inquiry management view powered by local Zustand persistence."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100/70">
                    {language === "BG" ? "Общо заявки" : "Total inquiries"}: {sortedInquiries.length}
                  </div>
                </div>

                {sortedInquiries.length === 0 ? (
                  <div className="rounded-[28px] border border-white/10 bg-black/15 p-6 text-sm text-stone-100/60">
                    {language === "BG" ? "Все още няма получени заявки." : "There are no inquiries yet."}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-[28px] border border-white/10 bg-black/10">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-white/5 text-stone-100/60">
                        <tr>
                          <th className="px-5 py-4">{language === "BG" ? "Гост" : "Guest"}</th>
                          <th className="px-5 py-4">{language === "BG" ? "Престой" : "Stay"}</th>
                          <th className="px-5 py-4">{language === "BG" ? "Къща" : "House"}</th>
                          <th className="px-5 py-4">{language === "BG" ? "Статус" : "Status"}</th>
                          <th className="px-5 py-4">{language === "BG" ? "Получена" : "Received"}</th>
                          <th className="px-5 py-4 text-right">{language === "BG" ? "Действия" : "Actions"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedInquiries.map((inquiry) => {
                          const house = houses.find((item) => item.id === inquiry.houseId);
                          const statusMeta = getInquiryStatusMeta(language, inquiry.status);

                          return (
                            <tr key={inquiry.id} className="border-t border-white/10 transition hover:bg-white/[0.03]">
                              <td className="px-5 py-4 align-top">
                                <p className="font-medium text-stone-50">{inquiry.firstName} {inquiry.lastName}</p>
                                <p className="mt-1 text-stone-100/55">{inquiry.phone}</p>
                                <p className="mt-1 text-stone-100/55">{inquiry.email}</p>
                              </td>
                              <td className="px-5 py-4 align-top text-stone-100/75">
                                <p>{formatDisplayDate(inquiry.checkIn)}</p>
                                <p className="mt-1">{formatDisplayDate(inquiry.checkOut)}</p>
                                <p className="mt-1 text-stone-100/55">{inquiry.guests} {language === "BG" ? "гости" : "guests"}</p>
                              </td>
                              <td className="px-5 py-4 align-top text-stone-100/75">{house?.name[language] ?? inquiry.houseId}</td>
                              <td className="px-5 py-4 align-top">
                                <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium", statusMeta.tone)}>
                                  <span className={cn("h-2 w-2 rounded-full", statusMeta.dot)} />
                                  {statusMeta.label}
                                </span>
                              </td>
                              <td className="px-5 py-4 align-top text-stone-100/55">{formatDisplayDate(inquiry.createdAt)}</td>
                              <td className="px-5 py-4 align-top">
                                <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => setSelectedInquiryId(inquiry.id)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-stone-50">
                                    <PencilLine className="h-4 w-4" />
                                    {language === "BG" ? "Редактирай" : "Edit"}
                                  </button>
                                  <button type="button" onClick={() => deleteInquiry(inquiry.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">
                                    <Trash2 className="h-4 w-4" />
                                    {copy.admin.delete}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </div>
      </main>
      {selectedInquiry && draftInquiry ? (
        <div className="fixed inset-0 z-[1300]">
          <button type="button" onClick={closeInquiryDrawer} className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" aria-label={language === "BG" ? "Затвори редактора" : "Close editor"} />
          <aside className="absolute inset-y-0 right-0 flex h-full max-h-screen w-full max-w-2xl flex-col border-l border-white/10 bg-[rgba(10,10,10,0.92)] shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-bronze-300">{language === "BG" ? "Детайли по заявка" : "Inquiry details"}</p>
                <h3 className="mt-2 text-2xl text-stone-50">{selectedInquiry.firstName} {selectedInquiry.lastName}</h3>
              </div>
              <button type="button" onClick={closeInquiryDrawer} className="rounded-full border border-white/10 bg-white/5 p-2 text-stone-100/70 transition hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-white/10 px-6 py-5">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">{language === "BG" ? "Бързи действия" : "Quick actions"}</p>
              <div className="flex flex-wrap gap-2">
                {inquiryStatusOrder.map((status) => {
                  const meta = getInquiryStatusMeta(language, status);
                  return (
                    <button key={status} type="button" onClick={() => handleInquiryStatusChange(status)} className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition", meta.tone, draftInquiry.status === status ? "ring-1 ring-white/20" : "")}>
                      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
              {statusRequestError ? <p className="mt-3 text-sm text-red-300">{statusRequestError}</p> : null}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-48">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Име" : "First name"}</span>
                  <input value={draftInquiry.firstName} onChange={(event) => setDraftInquiry((current) => current ? { ...current, firstName: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Фамилия" : "Last name"}</span>
                  <input value={draftInquiry.lastName} onChange={(event) => setDraftInquiry((current) => current ? { ...current, lastName: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Телефон" : "Phone"}</span>
                  <input value={draftInquiry.phone} onChange={(event) => setDraftInquiry((current) => current ? { ...current, phone: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">Email</span>
                  <input value={draftInquiry.email} onChange={(event) => setDraftInquiry((current) => current ? { ...current, email: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Къща" : "House"}</span>
                  <select value={draftInquiry.houseId} onChange={(event) => setDraftInquiry((current) => current ? { ...current, houseId: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none">
                    {houses.map((house) => <option key={house.id} value={house.id}>{house.name[language]}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Гости" : "Guests"}</span>
                  <input type="number" min={1} max={15} value={draftInquiry.guests} onChange={(event) => setDraftInquiry((current) => current ? { ...current, guests: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
                <DatePickerInput label={language === "BG" ? "Настаняване" : "Check-in"} placeholder={language === "BG" ? "Изберете дата" : "Select date"} value={draftInquiry.checkIn} onChange={(value) => setDraftInquiry((current) => current ? { ...current, checkIn: value, checkOut: current.checkOut && current.checkOut < value ? "" : current.checkOut } : current)} />
                <DatePickerInput label={language === "BG" ? "Напускане" : "Check-out"} placeholder={language === "BG" ? "Изберете дата" : "Select date"} value={draftInquiry.checkOut} onChange={(value) => setDraftInquiry((current) => current ? { ...current, checkOut: value } : current)} minDate={draftInquiry.checkIn ? new Date(draftInquiry.checkIn) : undefined} />
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Съобщение" : "Message"}</span>
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">{language === "BG" ? "Снимки" : "Images"}</p>
                  {selectedInquiryImages.length > 0 ? (
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      {selectedInquiryImages.map((image, index) => (
                        <a
                          key={image.id}
                          href={image.imageUrl ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-bronze-300/40 hover:bg-white/10"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
                            <Image
                              src={image.imageUrl ?? ""}
                              alt={`${selectedInquiry.firstName} ${selectedInquiry.lastName} ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 240px"
                              className="object-cover transition duration-300 group-hover:scale-[1.03]"
                              unoptimized={image.imageUrl?.startsWith("data:")}
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-stone-100/65">
                            <span className="truncate">{image.imagePath.split("/").pop() ?? image.imagePath}</span>
                            <span className="whitespace-nowrap text-bronze-300">{language === "BG" ? "Отвори" : "Open"}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-5 text-sm text-stone-100/55">{language === "BG" ? "Няма налични изображения към тази заявка." : "No images are available for this inquiry."}</div>
                  )}
                  <textarea rows={4} value={draftInquiry.message} onChange={(event) => setDraftInquiry((current) => current ? { ...current, message: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-stone-100/50">{language === "BG" ? "Бележки (Само за администратор)" : "Notes (Admin only)"}</span>
                  <textarea rows={5} value={draftInquiry.adminNotes} onChange={(event) => setDraftInquiry((current) => current ? { ...current, adminNotes: event.target.value } : current)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-50 outline-none" />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
              <button type="button" onClick={() => { deleteInquiry(selectedInquiry.id); closeInquiryDrawer(); }} className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                <Trash2 className="h-4 w-4" />
                {copy.admin.delete}
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={closeInquiryDrawer} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-100/80">{language === "BG" ? "Отказ" : "Cancel"}</button>
                <button type="button" onClick={saveInquiryDraft} className="rounded-2xl bg-stone-50 px-5 py-3 text-sm font-medium text-forest-950">{language === "BG" ? "Запази промените" : "Save changes"}</button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
