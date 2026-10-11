import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAgenda } from '../hooks/useAgenda.js';
import { UpcomingEventsCard } from './UpcomingEventsCard.js';
import { CalendarCard } from './CalendarCard.js';

/**
 * AgendaWidgets — composes UpcomingEventsCard + CalendarCard.
 * Owns the selectedDate state and supplies data from useAgenda.
 * To connect with Google Calendar: update useAgenda to fetch real data.
 */
export function AgendaWidgets() {
  const { daysOfWeek, calendarDays, eventsByDate, upcomingEvents, getDayLabel } = useAgenda();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<number>(17);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-x-12 lg:gap-x-12 gap-y-8 lg:gap-y-12 w-full items-start">
      {/* Header and Description: Top Right on desktop, top on mobile */}
      <div className="lg:col-start-2 lg:row-start-1">
        <div className="flex flex-col gap-1 select-none">
          <h2 className="font-serif text-[40px] lg:text-[48px] font-bold leading-[1.2] text-[#404041]">
            {t('agenda.title')}
          </h2>
          <p className="font-serif text-[16px] leading-[24px] text-[#6D6D6D]">
            {t('agenda.description')}
          </p>
        </div>
      </div>

      {/* Upcoming Events: Left Column on desktop, middle on mobile */}
      <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2">
        <UpcomingEventsCard events={upcomingEvents} />
      </div>

      {/* Calendar Card: Bottom Right on desktop, bottom on mobile */}
      <div className="lg:col-start-2 lg:row-start-2">
        <CalendarCard
          daysOfWeek={daysOfWeek}
          calendarDays={calendarDays}
          eventsByDate={eventsByDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          getDayLabel={getDayLabel}
          monthLabel={t('agenda.month_label')}
        />
      </div>
    </div>
  );
}
