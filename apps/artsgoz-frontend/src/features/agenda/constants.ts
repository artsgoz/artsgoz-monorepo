import { AgendaEvent, UpcomingEvent } from './types.js';

/**
 * Mock upcoming events for the UpcomingEventsCard.
 * dayLabels and title fields now store i18n translation keys.
 * TODO: Replace with live data from Google Calendar API (GET /calendars/{calendarId}/events).
 */
export const MOCK_UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    month: 'agenda.months.mar',
    day: 31,
    dayLabels: ['agenda.events.today', 'agenda.events.important'],
    title: 'agenda.events.submit_proposal',
    time: '13:00 – 15:00 น.',
    isToday: true,
  },
  {
    month: 'agenda.months.apr',
    day: 1,
    dayLabels: ['agenda.events.tomorrow', 'agenda.events.dont_forget'],
    title: 'agenda.events.national_seminar',
    time: '09:00 – 12:00 น.',
    isToday: false,
  },
  {
    month: 'agenda.months.apr',
    day: 2,
    dayLabel: 'agenda.events.important',
    title: 'agenda.events.internship_orientation',
    time: '10:00 – 12:00 น.',
    isToday: false,
  },
  {
    month: 'agenda.months.apr',
    day: 3,
    dayLabel: 'agenda.events.dont_forget',
    title: 'agenda.events.committee_meeting',
    time: '16:30 – 18:30 น.',
    isToday: false,
  },
];

/**
 * Mock calendar days for August 2025 (August 1st = Friday).
 * TODO: Derive dynamically from Google Calendar API response month/year.
 */
export const MOCK_CALENDAR_DAYS: (number | null)[] = [
  null, null, null, null, null, 1, 2,
  3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30,
  31, null, null, null, null, null, null,
];

/**
 * Mock events keyed by calendar day number.
 * title fields store i18n translation keys.
 * TODO: Replace with Google Calendar API events mapped to their date.
 */
export const MOCK_EVENTS_BY_DATE: Record<number, AgendaEvent[]> = {
  5: [
    { id: 'ev-1', title: 'agenda.events.submit_proposal', time: '13:00 - 15:00 น.', colorClass: 'bg-blue-500' },
  ],
  17: [
    { id: 'ev-2', title: 'agenda.events.national_seminar_full', time: '09:00 - 12:00 น.', colorClass: 'bg-[#E992B4]' },
    { id: 'ev-3', title: 'agenda.events.internship_orientation', time: '13:00 - 15:00 น.', colorClass: 'bg-yellow-500' },
  ],
  22: [
    { id: 'ev-4', title: 'agenda.events.faculty_committee_meeting', time: '16:30 - 18:30 น.', colorClass: 'bg-green-500' },
  ],
};

export const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
