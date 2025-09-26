import "./calendar.css";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useTheme } from "../../Context/ThemeContext";
import { GetBooking } from "../../hooks/getBooking";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarBookProps {
  userType: "mentor" | "mentee";
  user: string;
}

interface Booking {
  bookingId: number;
  menteeName: string;
  mentorName: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingUrl: string;
  menteeUserId: string;
  mentorUserId: string;
}

const CalendarBook = ({ userType, user }: CalendarBookProps) => {
  const [booking, setBooking] = useState<Booking[]>([]);
  const { isDark } = useTheme();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  useEffect(() => {
    const getBooking = async () => {
      const data = await GetBooking();
      const filtered = data.filter((b: Booking) =>
        userType === "mentor" ? b.mentorName === user : b.menteeName === user
      );

      console.log(filtered);

      const mapped = filtered.map((b: Booking) => ({
        bookingId: b.bookingId,
        mentorName: b.mentorName,
        menteeName: b.menteeName,
        title: userType === "mentor" ? b.menteeName : b.mentorName,
        startTime: new Date(b.startTime),
        endTime: new Date(new Date(b.endTime).getTime() + 60 * 60 * 1000),
        status: b.status,
        meetingUrl: b.meetingUrl,
      }));

      setBooking(mapped);
    };

    getBooking();
  }, []);

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
        startAccessor="startTime"
        endAccessor="endTime"
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
            width: "33",
          },
        })}
        components={{
          event: ({ event }: any) => (
            <div className="flex flex-col p-1">
              <span className="font-semibold text-sm text-white break-words">
                Meet with{" "}
                {userType === "mentor" ? event.menteeName : event.mentorName}
              </span>

              {event.meetingUrl && event.status === "Confirmed" && (
                <a
                  href={event.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] text-xs underline"
                >
                  Join Meeting
                </a>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default CalendarBook;
