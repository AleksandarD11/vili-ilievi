"use client";

import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { DatePickerInput } from "@/components/date-picker-input";
import { useSiteCopy } from "@/hooks/use-site-copy";
import { guestOptions } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type OpenPanel = "guests" | null;

type BookingFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  notes: string;
};

const initialFormState: BookingFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  checkIn: "",
  checkOut: "",
  notes: "",
};

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const BULGARIAN_PHONE_REGEX = /^(?:\+359|0)8\d{8}$/;
const HOUSE_ID = "booking-widget";

export function BookingWidget() {
  const { language, copy } = useSiteCopy();
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [form, setForm] = useState<BookingFormState>(initialFormState);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalGuests = adults + children;

  const labels = useMemo(
    () =>
      language === "BG"
        ? {
            firstName: "Име",
            lastName: "Фамилия",
            phone: "Телефон",
            email: "Имейл",
            notes: "Допълнителни бележки",
            requiredFields: "Моля, попълнете всички задължителни полета.",
            invalidPhone: "Въведете валиден български телефонен номер, започващ с 08 или +359.",
            invalidEmail: "Въведете валиден имейл адрес.",
            invalidDates: "Моля, изберете валидни дати за настаняване и напускане.",
            invalidGuests: "Броят гости трябва да бъде между 1 и 15.",
            submitSuccess: "Запитването беше записано успешно.",
            submitError: "Възникна грешка при записването на запитването.",
            saving: "Запазване...",
          }
        : {
            firstName: "First name",
            lastName: "Last name",
            phone: "Phone",
            email: "Email",
            notes: "Additional notes",
            requiredFields: "Please complete all required fields.",
            invalidPhone: "Please enter a valid Bulgarian phone number starting with 08 or +359.",
            invalidEmail: "Please enter a valid email address.",
            invalidDates: "Please select valid check-in and check-out dates.",
            invalidGuests: "Guests must be between 1 and 15.",
            submitSuccess: "Your inquiry was saved successfully.",
            submitError: "A submission error occurred while saving your inquiry.",
            saving: "Saving...",
          },
    [language],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const checkIn = form.checkIn.trim();
    const checkOut = form.checkOut.trim();
    const message = form.notes.trim();

    if (!firstName || !lastName || !phone || !email || !checkIn || !checkOut) {
      setError(labels.requiredFields);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError(labels.invalidEmail);
      return;
    }

    if (!BULGARIAN_PHONE_REGEX.test(phone)) {
      setError(labels.invalidPhone);
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || checkOut < checkIn) {
      setError(labels.invalidDates);
      return;
    }

    if (!Number.isInteger(totalGuests) || totalGuests < 1 || totalGuests > 15) {
      setError(labels.invalidGuests);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      );

      const { error: insertError } = await supabase.from("inquiries").insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        house_id: HOUSE_ID,
        guests: totalGuests,
        check_in: checkIn,
        check_out: checkOut,
        message,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setFeedback(labels.submitSuccess);
      setForm(initialFormState);
      setAdults(2);
      setChildren(0);
      setOpenPanel(null);
    } catch (submitError) {
      if (submitError instanceof Error && submitError.message.trim()) {
        setError(submitError.message);
      } else {
        setError(labels.submitError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-50 mx-auto w-full max-w-6xl">
      <div className="glass-panel grid gap-3 rounded-[28px] p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr_0.8fr] md:p-5">
        <DatePickerInput
          label={copy.booking.checkIn}
          placeholder={copy.booking.selectDate}
          value={form.checkIn}
          onChange={(value) => {
            setForm((current) => ({
              ...current,
              checkIn: value,
              checkOut: current.checkOut && current.checkOut < value ? "" : current.checkOut,
            }));
          }}
          minDate={new Date()}
          className="h-full bg-black/20"
        />

        <DatePickerInput
          label={copy.booking.checkOut}
          placeholder={copy.booking.selectDate}
          value={form.checkOut}
          onChange={(value) => setForm((current) => ({ ...current, checkOut: value }))}
          minDate={form.checkIn ? new Date(form.checkIn) : new Date()}
          className="h-full bg-black/20"
        />

        <label className="group relative block">
          <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
            {labels.firstName}
          </span>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
          />
        </label>

        <label className="group relative block">
          <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
            {labels.lastName}
          </span>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
          />
        </label>

        <label className="group relative block">
          <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
            {labels.phone}
          </span>
          <input
            type="tel"
            required
            pattern={BULGARIAN_PHONE_REGEX.source}
            title={labels.invalidPhone}
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
          />
        </label>

        <label className="group relative block">
          <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
            {labels.email}
          </span>
          <input
            type="email"
            required
            pattern={EMAIL_REGEX.source}
            title={labels.invalidEmail}
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
          />
        </label>

        <button
          type="button"
          onClick={() => setOpenPanel((current) => (current === "guests" ? null : "guests"))}
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left transition hover:border-bronze-300/50 hover:bg-white/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-bronze-300">
            <Users className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs uppercase tracking-[0.25em] text-stone-100/50">{copy.booking.guests}</span>
            <span className="mt-1 block text-sm text-stone-50 transition group-hover:text-white">
              {copy.booking.guestsValue(totalGuests)}
            </span>
          </span>
        </button>

        <label className="group relative block xl:col-span-2">
          <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
            {labels.notes}
          </span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="min-h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-7 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
          />
        </label>

        <button
          type="submit"
          className={cn(
            "cta-ring rounded-2xl bg-gradient-to-r from-bronze-400 to-accent px-6 py-4 font-medium text-forest-950 transition hover:scale-[1.02] xl:col-span-2",
            isSubmitting && "cursor-wait opacity-80 hover:scale-100",
          )}
          disabled={isSubmitting}
        >
          <span className="flex items-center justify-center gap-2 rounded-[14px] bg-stone-50 px-4 py-3">
            <Search className="h-4 w-4" />
            {isSubmitting ? labels.saving : copy.booking.availability}
          </span>
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm text-accent-soft">{feedback}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}

      {openPanel ? (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-[1200] mx-auto w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full rounded-[30px] border border-white/10 bg-black/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-100/55">{copy.booking.selectGuests}</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-stone-50">{copy.booking.adults}</span>
                <select
                  value={adults}
                  onChange={(event) => setAdults(Number(event.target.value))}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-stone-50 outline-none"
                >
                  {guestOptions.map((guestCount) => (
                    <option key={guestCount} value={guestCount}>
                      {guestCount}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-stone-50">{copy.booking.children}</span>
                <select
                  value={children}
                  onChange={(event) => setChildren(Number(event.target.value))}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-stone-50 outline-none"
                >
                  {Array.from({ length: 8 }, (_, index) => index).map((guestCount) => (
                    <option key={guestCount} value={guestCount}>
                      {guestCount}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </form>
  );
}
