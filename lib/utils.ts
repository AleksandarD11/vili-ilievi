import { clsx, type ClassValue } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDisplayDate(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;

  if (!isValid(date)) {
    return typeof value === "string" ? value : "";
  }

  return format(date, "dd/MM/yyyy");
}
