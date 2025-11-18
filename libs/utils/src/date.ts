import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Get current timestamp
 */
export function now(): Date {
  return new Date();
}

/**
 * Add minutes to date
 */
export function addMinutes(date: Date, minutes: number): Date {
  return dayjs(date).add(minutes, 'minute').toDate();
}

/**
 * Add hours to date
 */
export function addHours(date: Date, hours: number): Date {
  return dayjs(date).add(hours, 'hour').toDate();
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  return dayjs(date).add(days, 'day').toDate();
}

/**
 * Calculate difference in minutes
 */
export function diffInMinutes(date1: Date, date2: Date): number {
  return dayjs(date1).diff(dayjs(date2), 'minute');
}

/**
 * Calculate difference in hours
 */
export function diffInHours(date1: Date, date2: Date): number {
  return dayjs(date1).diff(dayjs(date2), 'hour');
}

/**
 * Calculate difference in days
 */
export function diffInDays(date1: Date, date2: Date): number {
  return dayjs(date1).diff(dayjs(date2), 'day');
}

/**
 * Format date
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * Format datetime
 */
export function formatDateTime(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function fromNow(date: Date): string {
  return dayjs(date).fromNow();
}

/**
 * Convert to timezone
 */
export function toTimezone(date: Date, timezone: string): Date {
  return dayjs(date).tz(timezone).toDate();
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  return dayjs(date).isBefore(dayjs());
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  return dayjs(date).isAfter(dayjs());
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  return dayjs(date).startOf('day').toDate();
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  return dayjs(date).endOf('day').toDate();
}

/**
 * Calculate ETA based on distance and average speed
 */
export function calculateETA(distanceKm: number, averageSpeedKmh: number): Date {
  const durationHours = distanceKm / averageSpeedKmh;
  const durationMinutes = durationHours * 60;
  return addMinutes(now(), durationMinutes);
}
