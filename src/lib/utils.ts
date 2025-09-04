import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Memoized date formatter for performance
const dateFormatCache = new Map<string, string>();

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "";

  const dateKey =
    date instanceof Date ? date.getTime().toString() : String(date);

  if (dateFormatCache.has(dateKey)) {
    return dateFormatCache.get(dateKey)!;
  }

  try {
    const formatted = new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Limit cache size to prevent memory leaks
    if (dateFormatCache.size > 1000) {
      const firstKey = dateFormatCache.keys().next().value;
      if (firstKey) {
        dateFormatCache.delete(firstKey);
      }
    }

    dateFormatCache.set(dateKey, formatted);
    return formatted;
  } catch {
    return "";
  }
}

// Clear date format cache (useful for memory management)
export function clearDateFormatCache(): void {
  dateFormatCache.clear();
}
