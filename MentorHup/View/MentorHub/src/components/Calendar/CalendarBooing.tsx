import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useTheme } from "../../Context/ThemeContext"; // ThemeContext

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: number;
  menteeName: string;
  topic: string;
  start: string;
  end: string;
  status: "Confirmed" | "Canceled";
}

const mockData: Booking[] = [
  {
    id: 1,
    menteeName: "Sara",
    topic: "React Basics",
    start: "2025-09-11T10:00:00",
    end: "2025-09-11T11:00:00",
    status: "Confirmed",
  },
  {
    id: 2,
    menteeName: "Ahmad",
    topic: "Next.js Routing",
    start: "2025-09-12T12:00:00",
    end: "2025-09-12T13:00:00",
    status: "Canceled",
  },
];

const CalendarBook = () => {
  const { isDark } = useTheme();
  const [booking, setBooking] = useState<any[]>([]);

  useEffect(() => {
    const mapped = mockData.map((b) => ({
      ...b,
      title: `${b.menteeName} - ${b.topic}`,
      start: new Date(b.start),
      end: new Date(b.end),
    }));
    setBooking(mapped);
  }, []);

  return (
    <div
      className={`p-6 min-h-[700px] relative ${
        isDark ? "bg-[var(--primay-light)]" : "bg-[var(--secondary-ligh)]"
      }`}
    >
      <h1
        className={`text-xl font-bold mb-4 ${
          isDark ? "text-[var(--secondary-light)]" : "text-[var(--primary)]"
        }`}
      >
        My Bookings
      </h1>
      <Calendar
        localizer={localizer}
        events={booking}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.WEEK}
        toolbar={true}
        style={{ height: "600px" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.status === "Confirmed" && isDark ? "green" : "red",
            color: "white",
            borderRadius: "6px",
            padding: "2px 4px",
            fontSize: "14px",
            fontWeight: "bold",
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        })}
      />
    </div>
  );
};

export default CalendarBook;
