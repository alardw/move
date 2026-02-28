import type { CalendarConstraints } from './types';

// ============================================================================
// First day of week detection
// ============================================================================

const FIRST_DAY_MAP: Record<string, number> = {
  US: 0, CA: 0, JP: 0, BR: 0, MX: 0,
  GB: 1, DE: 1, FR: 1, ES: 1, IT: 1, NL: 1, SE: 1, NO: 1, DK: 1, FI: 1,
  PL: 1, CZ: 1, SK: 1, HU: 1, RO: 1, BG: 1, HR: 1, SI: 1, RS: 1,
  RU: 1, UA: 1, BY: 1, LT: 1, LV: 1, EE: 1,
  CN: 1, KR: 1, IN: 1, TW: 1, TH: 1, VN: 1,
  AU: 1, NZ: 1, ZA: 1,
  SA: 6, AE: 6, QA: 6, KW: 6, BH: 6, OM: 6,
  IR: 6, AF: 6,
  IL: 0,
  EG: 6, DZ: 6, MA: 6, TN: 6, LY: 6,
};

export function getLocaleFirstDay(locale: string): number {
  try {
    const loc = new Intl.Locale(locale);
    if ('getWeekInfo' in loc) return ((loc as any).getWeekInfo().firstDay) % 7;
    if ('weekInfo' in loc) return ((loc as any).weekInfo.firstDay) % 7;
  } catch {
    // fallback
  }
  const region = locale.split('-')[1];
  if (region) return FIRST_DAY_MAP[region.toUpperCase()] ?? 0;
  return 0;
}

// ============================================================================
// Date creation & comparison
// ============================================================================

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(date: Date, ref: Date): boolean {
  return (
    date.getFullYear() === ref.getFullYear() &&
    date.getMonth() === ref.getMonth()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const d = startOfDay(date).getTime();
  const s = startOfDay(start).getTime();
  const e = startOfDay(end).getTime();
  return d >= s && d <= e;
}

export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

// ============================================================================
// Date arithmetic
// ============================================================================

export function addDays(date: Date, count: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + count);
  return d;
}

export function addMonths(date: Date, count: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + count);
  // Handle month overflow (e.g. Jan 31 + 1 month = Feb 28)
  if (d.getDate() !== day) {
    d.setDate(0); // Go to last day of previous month
  }
  return d;
}

export function addYears(date: Date, count: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + count);
  return d;
}

// ============================================================================
// Grid generation
// ============================================================================

export function getMonthGrid(
  year: number,
  month: number,
  weekStartsOn: number,
  fixedWeeks = false
): Date[][] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  // How many days to go back to reach weekStartsOn
  const offset = (startDow - weekStartsOn + 7) % 7;
  const gridStart = addDays(firstDay, -offset);

  const weeks: Date[][] = [];
  let current = gridStart;
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(current));
      current = addDays(current, 1);
    }
    // In dynamic mode, stop if this entire week is in the next month
    if (!fixedWeeks && w >= 4 && week[0].getMonth() !== month) break;
    weeks.push(week);
  }
  return weeks;
}

export function getWeekRange(
  date: Date,
  weekStartsOn: number
): { start: Date; end: Date } {
  const dow = date.getDay();
  const offset = (dow - weekStartsOn + 7) % 7;
  const start = addDays(startOfDay(date), -offset);
  const end = addDays(start, 6);
  return { start, end };
}

// ============================================================================
// Formatting (Intl-based)
// ============================================================================

export function getWeekDayNames(
  locale: string,
  format: 'long' | 'short' | 'narrow' = 'short',
  weekStartsOn: number = 0
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const names: string[] = [];
  // Jan 4 2026 is a Sunday (day 0)
  const base = new Date(2026, 0, 4);
  for (let i = 0; i < 7; i++) {
    const dow = (weekStartsOn + i) % 7;
    const d = addDays(base, dow);
    names.push(formatter.format(d));
  }
  return names;
}

export function formatMonthYear(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
}

export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(
    locale,
    options ?? { dateStyle: 'short' }
  ).format(date);
}

export function formatTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getMonthNames(
  locale: string,
  format: 'long' | 'short' = 'long'
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2026, i, 1))
  );
}

// ============================================================================
// Time grid
// ============================================================================

export function getTimeSlots(
  startHour: number = 0,
  endHour: number = 24,
  intervalMinutes: number = 60
): Date[] {
  const slots: Date[] = [];
  const base = new Date(2026, 0, 1);
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const slot = new Date(base);
      slot.setHours(h, m, 0, 0);
      slots.push(slot);
    }
  }
  return slots;
}

// ============================================================================
// Constraints
// ============================================================================

export function isDateDisabled(
  date: Date,
  constraints?: CalendarConstraints
): boolean {
  if (!constraints) return false;
  const d = startOfDay(date);

  if (constraints.min && isBefore(d, constraints.min)) return true;
  if (constraints.max && isAfter(d, constraints.max)) return true;
  if (constraints.disabledDaysOfWeek?.includes(d.getDay())) return true;
  if (constraints.disabledDates?.some((dd) => isSameDay(d, dd))) return true;

  return false;
}

// ============================================================================
// Parsing (Intl-based)
// ============================================================================

type DatePartOrder = 'mdy' | 'dmy' | 'ymd';

function detectLocaleOrder(locale: string): { order: DatePartOrder; separator: string } {
  const ref = new Date(2033, 10, 25); // Nov 25 2033 — all parts are unambiguous
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).formatToParts(ref);
  } catch {
    return { order: 'mdy', separator: '/' };
  }

  const types: string[] = [];
  let sep = '/';
  for (const p of parts) {
    if (p.type === 'month' || p.type === 'day' || p.type === 'year') {
      types.push(p.type);
    } else if (p.type === 'literal' && types.length === 1) {
      sep = p.value.trim() || p.value;
    }
  }

  const key = types.slice(0, 3).join('-');
  const order: DatePartOrder =
    key === 'day-month-year' ? 'dmy' :
    key === 'year-month-day' ? 'ymd' :
    'mdy';

  return { order, separator: sep };
}

export function getLocaleDatePattern(locale: string): string {
  // Use single-digit month (3) and day (5) to detect zero-padding
  const ref = new Date(2033, 2, 5); // Mar 5 2033
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).formatToParts(ref);
  } catch {
    return 'M/D/YY';
  }

  return parts
    .map((p) => {
      if (p.type === 'month') return p.value.length >= 2 ? 'MM' : 'M';
      if (p.type === 'day') return p.value.length >= 2 ? 'DD' : 'D';
      if (p.type === 'year') return p.value.length >= 4 ? 'YYYY' : 'YY';
      if (p.type === 'literal') return p.value;
      return '';
    })
    .join('');
}

export function parseDate(text: string, locale: string): Date | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const nums = trimmed.split(/[/\-.\s]+/).map(Number);
  if (nums.length !== 3 || nums.some(isNaN)) return null;

  const { order } = detectLocaleOrder(locale);

  let year: number, month: number, day: number;
  if (order === 'dmy') {
    [day, month, year] = nums;
  } else if (order === 'ymd') {
    [year, month, day] = nums;
  } else {
    [month, day, year] = nums;
  }

  // Handle 2-digit years
  if (year < 100) year += 2000;

  // Validate ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  // Verify the date didn't overflow (e.g. Feb 30 → Mar 2)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return startOfDay(date);
}

// ============================================================================
// Week numbers
// ============================================================================

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
