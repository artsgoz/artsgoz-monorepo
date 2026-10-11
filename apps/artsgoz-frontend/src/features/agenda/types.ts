/**
 * Represents a single calendar event.
 * This interface is designed to be compatible with Google Calendar API event objects.
 * @see https://developers.google.com/calendar/api/v3/reference/events
 */
export interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  colorClass: string;
}

/** Upcoming event row data for the UpcomingEventsCard */
export interface UpcomingEvent {
  month: string;
  day: number;
  dayLabel?: string;        // e.g. "วันนี้", "พรุ่งนี้", "พฤ."
  dayLabels?: string[];     // Array of labels for multiple chips
  title: string;
  time: string;
  isToday: boolean;
}
