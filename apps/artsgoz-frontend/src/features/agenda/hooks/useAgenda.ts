import {
  MOCK_CALENDAR_DAYS,
  MOCK_EVENTS_BY_DATE,
  MOCK_UPCOMING_EVENTS,
  DAYS_OF_WEEK,
} from '../constants.js';
import { AgendaEvent, UpcomingEvent } from '../types.js';

/**
 * useAgenda — manages calendar and upcoming events data.
 *
 * Currently uses mock data. Ready for Google Calendar API integration:
 * - Replace MOCK_UPCOMING_EVENTS with a useQuery fetching GET /calendars/primary/events
 * - Replace MOCK_CALENDAR_DAYS / MOCK_EVENTS_BY_DATE with derived data from the API response
 *
 * @see https://developers.google.com/calendar/api/v3/reference/events/list
 */
export function useAgenda(): {
  daysOfWeek: string[];
  calendarDays: (number | null)[];
  eventsByDate: Record<number, AgendaEvent[]>;
  upcomingEvents: UpcomingEvent[];
  getDayLabel: (day: number) => string;
} {
  const getDayLabel = (day: number): string => {
    const daysName = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    // August 1st 2025 was Friday (index 5).
    const index = (5 + day - 1) % 7;
    return daysName[index];
  };

  return {
    daysOfWeek: DAYS_OF_WEEK,
    calendarDays: MOCK_CALENDAR_DAYS,
    eventsByDate: MOCK_EVENTS_BY_DATE,
    upcomingEvents: MOCK_UPCOMING_EVENTS,
    getDayLabel,
  };
}
