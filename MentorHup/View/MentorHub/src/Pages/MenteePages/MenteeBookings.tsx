import CalendarBook from "../../components/Calendar/CalendarBooking";
import MenteeTableBooking from "../../components/Tables/MenteeTableBooking";

const MenteeBookings = () => {
  const user = localStorage.getItem("userName");

  return (
    <>
      <CalendarBook userType="mentee" user={user!} />
      {/* Table Sessions */}
      <div className="py-7 w-full">
        <MenteeTableBooking />
      </div>
    </>
  );
};

export default MenteeBookings;
