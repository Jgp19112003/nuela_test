import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect } from "react";

// Define la estructura de cada evento
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

// Define el tipo del prop eventos como un array de CalendarEvent
interface CalendarAppProps {
  eventos: CalendarEvent[];
}

function CalendarApp({ eventos }: CalendarAppProps) {
  console.log(eventos);

  const plugins = [createEventsServicePlugin()];

  // Crear instancia de calendario solo una vez
  const calendar = useCalendarApp(
    {
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      events: [], // Inicialmente vacío, los eventos se añadirán dinámicamente
    },
    plugins
  );

  useEffect(() => {
    // Actualiza los eventos cuando el prop `eventos` cambie
    calendar.eventsService.set(eventos);
    console.log("Eventos actualizados:", eventos);
  }, [eventos, calendar.eventsService]); // Escucha cambios en `eventos` y `calendar.eventsService`

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
