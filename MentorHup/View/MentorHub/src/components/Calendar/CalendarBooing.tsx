import "./calendar.css";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useTheme } from "../../Context/ThemeContext";

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
    menteeName: "Qamar",
    topic: "Next.js Routing",
    start: "2025-09-12T12:00:00",
    end: "2025-09-12T13:00:00",
    status: "Canceled",
  },
  {
    id: 3,
    menteeName: "Yara",
    topic: "Node.js",
    start: "2025-09-16T15:00:00",
    end: "2025-09-16T16:00:00",
    status: "Confirmed",
  },
];

const CalendarBook = () => {
  const [booking, setBooking] = useState<any[]>([]);
  const { isDark } = useTheme();

  useEffect(() => {
    const mapped = mockData.map((boo) => ({
      id: boo.id,
      title: `${boo.menteeName} - ${boo.topic}`,
      start: new Date(boo.start),
      end: new Date(boo.end),
      status: boo.status,
    }));
    setBooking(mapped);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState< Views >(Views.MONTH);

  return (
    <div
      className={`p-6 min-h-[700px] relative rounded-[16px] ${
        isDark
          ? "text-[var(--accent)] bg-[var(--primary-rgba)]"
          : "text-[var(--primary-rgba)] bg-[var(--secondary-light)] shadow-xl"
      }`}
    >
      <h1
        className={`${
          isDark ? "text-white" : "text-black"
        } text-xl font-bold mb-4`}
      >
        My Bookings
      </h1>
      <Calendar
        localizer={localizer}
        events={booking}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(v) => setView(v)}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        toolbar={true}
        style={{ height: "600px" }}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        className={`${isDark ? "calendar-dark" : "calendar-light"}`}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.status === "Confirmed"
                ? "var(--secondary-dark)"
                : "var(--red-light)",
            color: "white",
            borderRadius: "6px",
            padding: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            height: "60px",
          },
        })}
      />
    </div>
  );
};

export default CalendarBook;
