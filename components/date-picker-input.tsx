"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format, parseISO, startOfDay } from "date-fns";
import { bg } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn, formatDisplayDate } from "@/lib/utils";

type DatePickerInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  className?: string;
};

type FloatingPosition = {
  left: number;
  top: number;
  width: number;
};

export function DatePickerInput({
  label,
  placeholder,
  value,
  onChange,
  minDate,
  className,
}: DatePickerInputProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useMemo(() => `date-picker-panel-${label.replace(/\s+/g, "-").toLowerCase()}`, [label]);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState<FloatingPosition>({
    left: 0,
    top: 0,
    width: 0,
  });
  const minSelectableDate = useMemo(() => (minDate ? startOfDay(minDate) : undefined), [minDate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) {
        return;
      }

      const rect = triggerRef.current.getBoundingClientRect();
      setFloatingPosition({
        left: rect.left,
        top: rect.bottom + 12,
        width: Math.max(rect.width, 320),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (triggerRef.current?.contains(target)) {
        return;
      }

      const floatingPanel = document.getElementById(panelId);
      if (floatingPanel?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, panelId]);

  const selectedDate = useMemo(() => {
    if (!value) {
      return undefined;
    }

    const parsedDate = parseISO(value);
    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const floatingPanel =
    mounted && isOpen
      ? createPortal(
          <div
            id={panelId}
            className="fixed z-[1400]"
            style={{
              left: `${floatingPosition.left}px`,
              top: `${floatingPosition.top}px`,
              width: `${floatingPosition.width}px`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="rounded-[30px] border border-white/10 bg-black/80 p-4 backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-stone-100/55">{label}</p>
              <DayPicker
                mode="single"
                locale={bg}
                selected={selectedDate}
                onSelect={handleDateSelect}
                onDayClick={handleDateSelect}
                disabled={minSelectableDate ? { before: minSelectableDate } : undefined}
                className="text-stone-50"
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-4",
                  caption: "flex items-center justify-between px-1 text-sm font-semibold tracking-[0.08em] text-stone-50",
                  nav: "flex items-center gap-2",
                  button_previous:
                    "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-50 transition hover:bg-white/12",
                  button_next:
                    "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-50 transition hover:bg-white/12",
                  weekdays: "mb-2 grid grid-cols-7",
                  weekday: "text-center text-[11px] uppercase tracking-[0.2em] text-stone-100/45",
                  week: "mt-1 flex w-full justify-between",
                  day: "h-11 w-11 rounded-full text-sm text-stone-100 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880]/60",
                  day_button: "h-11 w-11 rounded-full",
                  selected:
                    "bg-[#C5A880] text-black shadow-[0_0_10px_rgba(197,168,128,0.5)] hover:bg-[#C5A880] hover:text-black",
                  today: "border border-[#C5A880]/50 text-[#E8D7BD]",
                  disabled: "text-stone-100/25",
                }}
              />
            </motion.div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "group relative block h-16 w-full rounded-2xl border border-white/10 bg-black/20 px-4 pt-6 text-left outline-none transition hover:border-bronze-300/50 hover:bg-white/10",
          className,
        )}
      >
        <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.24em] text-stone-100/45">
          {label}
        </span>
        <span
          className={cn(
            "pointer-events-none block w-full pr-8 text-sm",
            value ? "text-stone-50" : "text-stone-100/45",
          )}
        >
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze-300">
          <CalendarDays className="h-4 w-4" />
        </span>
      </button>
      {floatingPanel}
    </>
  );
}
