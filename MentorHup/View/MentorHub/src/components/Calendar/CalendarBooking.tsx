// import "./calendar.css";
// import { useEffect, useState } from "react";
// import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
// import type { View } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import { enUS } from "date-fns/locale";
// import { useTheme } from "../../Context/ThemeContext";
// import { GetBooking } from "../../hooks/getBooking";

// const locales = { "en-US": enUS };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// interface CalendarBookProps {
//   userType: "mentor" | "mentee";
//   user: string;
// }

// interface Booking {
//   bookingId: number;
//   menteeName: string;
//   mentorName: string;
//   startTime: string;
//   endTime: string;
//   status: string;
//   meetingUrl: string;
//   menteeUserId: string;
//   mentorUserId: string;
// }

// const CalendarBook = ({ userType, user }: CalendarBookProps) => {
//   const [booking, setBooking] = useState<Booking[]>([]);
//   const { isDark } = useTheme();

//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [view, setView] = useState<View>(Views.MONTH);

//   useEffect(() => {
//     const getBooking = async () => {
//       const data = await GetBooking();
//       const filtered = data.filter((b: Booking) =>
//         userType === "mentor" ? b.mentorName === user : b.menteeName === user
//       );

//       console.log(filtered); //هون بجيب الداتا

//       const mapped = filtered.map((b: Booking) => ({
//         bookingId: b.bookingId,
//         mentorName: b.mentorName,
//         menteeName: b.menteeName,
//         title: userType === "mentor" ? b.menteeName : b.mentorName,
//         startTime: new Date(b.startTime),
//         endTime: new Date(new Date(b.endTime).getTime() + 60 * 60 * 1000),
//         status: b.status,
//         meetingUrl: b.meetingUrl,
//       }));

//       setBooking(mapped);
//       console.log(mapped); // هون ما بجيب الداتا
//     };

//     getBooking();
//   }, []);

//   return (
//     <div
//       className={`p-6 min-h-[700px] relative rounded-[16px] ${
//         isDark
//           ? "text-[var(--accent)] bg-[var(--primary-rgba)]"
//           : "text-[var(--primary-rgba)] bg-[var(--secondary-light)] shadow-xl"
//       }`}
//     >
//       <h1
//         className={`${
//           isDark ? "text-white" : "text-black"
//         } text-xl font-bold mb-4`}
//       >
//         My Bookings
//       </h1>
//       <Calendar
//         localizer={localizer}
//         events={booking}
//         startAccessor="startTime"
//         endAccessor="endTime"
//         view={view}
//         onView={(v) => setView(v)}
//         views={[Views.MONTH, Views.WEEK, Views.DAY]}
//         toolbar={true}
//         style={{ height: "600px" }}
//         date={currentDate}
//         onNavigate={(date) => setCurrentDate(date)}
//         className={`${isDark ? "calendar-dark" : "calendar-light"}`}
//         eventPropGetter={(event) => ({
//           style: {
//             backgroundColor:
//               event.status === "Confirmed"
//                 ? "var(--secondary-dark)"
//                 : "var(--red-light)",
//             color: "white",
//             borderRadius: "6px",
//             padding: "4px",
//             fontSize: "14px",
//             fontWeight: "bold",
//             height: "60px",
//             width: "33",
//           },
//         })}
//         components={{
//           event: ({ event }: any) => (
//             <div className="flex flex-col p-1">
//               <span className="font-semibold text-sm text-white break-words">
//                 Meet with{" "}
//                 {userType === "mentor" ? event.menteeName : event.mentorName}
//               </span>

//               {event.meetingUrl && event.status === "Confirmed" && (
//                 <a
//                   href={event.meetingUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-[var(--primary)] text-xs underline"
//                 >
//                   Join Meeting
//                 </a>
//               )}
//             </div>
//           ),
//         }}
//       />
//     </div>
//   );
// };

// export default CalendarBook;

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { useTheme } from "../../Context/ThemeContext";
import { GetBooking } from "../../hooks/getBooking";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
} from "lucide-react";

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const getBooking = async () => {
      try {
        const data = await GetBooking();
        console.log("Raw data:", data);

        const filtered = data.filter((b: Booking) =>
          userType === "mentor" ? b.mentorName === user : b.menteeName === user
        );
        console.log("Filtered bookings:", filtered);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    getBooking();
  }, [user, userType]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime);
      return isSameDay(bookingDate, date);
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const selectedDateBookings = selectedDate
    ? getBookingsForDate(selectedDate)
    : [];

  return (
    <div
      className={`p-6 min-h-[700px] relative rounded-[16px] ${
        isDark
          ? "text-[var(--accent)] bg-[var(--primary-rgba)]"
          : "text-[var(--primary-rgba)] bg-[var(--secondary-light)] shadow-xl"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className={`${
            isDark ? "text-white" : "text-black"
          } text-xl font-bold`}
        >
          My Bookings
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <CalendarIcon size={16} />
          <span>Total: {bookings.length} bookings</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth("prev")}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <h2
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {format(currentDate, "MMMM yyyy")}
            </h2>

            <button
              onClick={() => navigateMonth("next")}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week header */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className={`p-3 text-center text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day) => {
              const dayBookings = getBookingsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[80px] p-2 cursor-pointer border rounded-lg transition-all
                    ${isCurrentMonth ? "" : "opacity-40"}
                    ${
                      isCurrentDay
                        ? isDark
                          ? "bg-blue-900 border-blue-600"
                          : "bg-blue-100 border-blue-300"
                        : ""
                    }
                    ${
                      isSelected
                        ? isDark
                          ? "bg-gray-700 border-gray-500"
                          : "bg-gray-200 border-gray-400"
                        : ""
                    }
                    ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  <div
                    className={`text-sm mb-1 ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {format(day, "d")}
                  </div>

                  {dayBookings.length > 0 && (
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.bookingId}
                          className={`
                            text-xs p-1 rounded truncate
                            ${
                              booking.status === "Confirmed"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                          `}
                          title={`${format(
                            new Date(booking.startTime),
                            "HH:mm"
                          )} - ${
                            userType === "mentor"
                              ? booking.menteeName
                              : booking.mentorName
                          }`}
                        >
                          {format(new Date(booking.startTime), "HH:mm")}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Selected Date Details */}
        <div
          className={`rounded-lg p-4 ${
            isDark ? "bg-gray-800" : "bg-white shadow-md"
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Select a date"}
          </h3>

          {selectedDate && selectedDateBookings.length > 0 ? (
            <div className="space-y-3">
              {selectedDateBookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className={`p-3 rounded-lg border ${
                    isDark
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4
                        className={`font-medium ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {userType === "mentor"
                          ? booking.menteeName
                          : booking.mentorName}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={12} />
                        <span>
                          {format(new Date(booking.startTime), "HH:mm")} -{" "}
                          {format(new Date(booking.endTime), "HH:mm")}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`
                      px-2 py-1 text-xs rounded-full
                      ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {booking.meetingUrl && booking.status === "Confirmed" && (
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink size={12} />
                      Join Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <p className="text-gray-500 text-sm">No bookings for this date</p>
          ) : (
            <p className="text-gray-500 text-sm">
              Click on a date to view bookings
            </p>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          isDark ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Bookings:</span>
            <span
              className={`ml-2 font-semibold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {bookings.length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Confirmed:</span>
            <span className="ml-2 font-semibold text-green-600">
              {bookings.filter((b) => b.status === "Confirmed").length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">This Month:</span>
            <span
              className={`ml-2 font-semibold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {
                bookings.filter((b) =>
                  isSameMonth(new Date(b.startTime), currentDate)
                ).length
              }
            </span>
          </div>
          <div>
            <span className="text-gray-500">User Type:</span>
            <span
              className={`ml-2 font-semibold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {userType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBook;
