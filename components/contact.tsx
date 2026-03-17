"use client";

import { motion } from "framer-motion";
import { Mail, MapPinned, Phone } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { DatePickerInput } from "@/components/date-picker-input";
import { useSiteCopy } from "@/hooks/use-site-copy";
import { BULGARIAN_PHONE_PATTERN, EMAIL_PATTERN } from "@/lib/inquiry-validation";
import { useAdminStore } from "@/stores/admin-store";

type ContactFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  houseId: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  message: string;
};

const initialFormState: ContactFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  houseId: "house-1",
  guests: "2",
  checkIn: "",
  checkOut: "",
  message: "",
};

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const { language, copy } = useSiteCopy();
  const houses = useAdminStore((state) => state.houses);
  const addInquiry = useAdminStore((state) => state.addInquiry);

  const labels = useMemo(
    () =>
      language === "BG"
        ? {
            firstName: "Име",
            lastName: "Фамилия",
            phone: "Телефон",
            email: "Имейл",
            house: "Избрана къща",
            guests: "Брой гости",
            checkIn: "Настаняване",
            checkOut: "Напускане",
            message: "Допълнителни бележки",
            success: "Запитването е записано успешно и е добавено в админ панела.",
            selectDate: "Изберете дата",
            invalidPhone: "Въведете валиден български телефонен номер.",
            invalidEmail: "Въведете валиден имейл адрес.",
            submitError: "Възникна грешка при изпращането.",
            sending: "Изпращане...",
          }
        : {
            firstName: "First name",
            lastName: "Last name",
            phone: "Phone",
            email: "Email",
            house: "Selected house",
            guests: "Guests",
            checkIn: "Check-in",
            checkOut: "Check-out",
            message: "Additional notes",
            success: "Your inquiry was saved successfully and added to the admin panel.",
            selectDate: "Select a date",
            invalidPhone: "Please enter a valid Bulgarian phone number.",
            invalidEmail: "Please enter a valid email address.",
            submitError: "A submission error occurred.",
            sending: "Sending...",
          },
    [language],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitWarning(null);
    setIsSubmitted(false);

    if (!form.checkIn || !form.checkOut) {
      setSubmitError(labels.selectDate);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          houseId: form.houseId,
          guests: Number(form.guests),
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error ?? labels.submitError);
        return;
      }

      addInquiry(result.inquiry);
      setSubmitWarning(result.warning ?? null);
      setIsSubmitted(true);
      setForm(initialFormState);
    } catch {
      setSubmitError(labels.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-shell pb-16">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">{copy.contact.sectionLabel}</span>
            <h2 className="text-4xl text-stone-50 md:text-5xl">{copy.contact.heading}</h2>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                { key: "firstName", label: labels.firstName, type: "text" },
                { key: "lastName", label: labels.lastName, type: "text" },
                {
                  key: "phone",
                  label: labels.phone,
                  type: "tel",
                  pattern: BULGARIAN_PHONE_PATTERN,
                  title: labels.invalidPhone,
                },
                {
                  key: "email",
                  label: labels.email,
                  type: "email",
                  pattern: EMAIL_PATTERN,
                  title: labels.invalidEmail,
                },
              ].map((field) => (
                <label key={field.key} className="group relative block">
                  <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    required
                    pattern={field.pattern}
                    title={field.title}
                    value={form[field.key as keyof ContactFormState] as string}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
                  />
                </label>
              ))}

              <DatePickerInput
                label={labels.checkIn}
                placeholder={labels.selectDate}
                value={form.checkIn}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    checkIn: value,
                    checkOut: current.checkOut && current.checkOut < value ? "" : current.checkOut,
                  }))
                }
                minDate={new Date()}
              />

              <DatePickerInput
                label={labels.checkOut}
                placeholder={labels.selectDate}
                value={form.checkOut}
                onChange={(value) => setForm((current) => ({ ...current, checkOut: value }))}
                minDate={form.checkIn ? new Date(form.checkIn) : new Date()}
              />

              <label className="group relative block">
                <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
                  {labels.house}
                </span>
                <select
                  required
                  value={form.houseId}
                  onChange={(event) => setForm((current) => ({ ...current, houseId: event.target.value }))}
                  className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
                >
                  {houses.map((house) => (
                    <option key={house.id} value={house.id}>
                      {house.name[language]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="group relative block">
                <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
                  {labels.guests}
                </span>
                <input
                  type="number"
                  min={1}
                  max={15}
                  required
                  value={form.guests}
                  onChange={(event) => setForm((current) => ({ ...current, guests: event.target.value }))}
                  className="h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
                />
              </label>

              <label className="group relative block md:col-span-2">
                <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
                  {labels.message}
                </span>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-7 text-sm text-stone-50 outline-none transition focus:border-bronze-300/50"
                />
              </label>

              <div className="md:col-span-2">
                <button
                  disabled={!form.checkIn || !form.checkOut || isSubmitting}
                  className="cta-ring mt-2 w-full rounded-2xl px-[1px] py-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="block rounded-2xl bg-stone-50 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-forest-950">
                    {isSubmitting ? labels.sending : copy.contact.submit}
                  </span>
                </button>
              </div>

              {submitError ? <p className="md:col-span-2 text-sm text-red-300">{submitError}</p> : null}
              {submitWarning ? <p className="md:col-span-2 text-sm text-amber-200">{submitWarning}</p> : null}
              {isSubmitted ? <p className="md:col-span-2 text-sm text-accent-soft">{labels.success}</p> : null}
            </form>
          </motion.div>

          <motion.div
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-bronze-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-stone-100/45">{copy.contact.phone}</p>
                  <a href="tel:+359879823395" className="mt-1 block text-xl text-stone-50">
                    +359 879 823 395
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-bronze-300">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-stone-100/45">Email</p>
                  <a href="mailto:viliilievi@abv.bg" className="mt-1 block text-xl text-stone-50">
                    viliilievi@abv.bg
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-bronze-300">
                  <MapPinned className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-stone-100/45">{copy.contact.location}</p>
                  <p className="mt-1 text-xl text-stone-50">{copy.contact.locationValue}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
              <iframe
                title="Vili Ilievi location"
                src="https://www.google.com/maps?q=Tsigov%20Chark%2C%20Bulgaria&z=14&output=embed"
                className="h-[360px] w-full grayscale invert-[0.88] contrast-125 saturate-50"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
