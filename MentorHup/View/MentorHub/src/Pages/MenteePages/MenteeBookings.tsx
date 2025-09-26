import CalendarBook from "../../components/Calendar/CalendarBooking";
import MenteeTableBooking from "../../components/Tables/MenteeTableBooking";

const MenteeBookings = () => {
  const userName = localStorage.getItem("userName");

  return (
    <>
      <CalendarBook userType="mentee" user={userName!} />
      {/* Table Sessions */}
      <div className="py-7 w-full">
        <MenteeTableBooking />
      </div>
    </>
  );
};

export default MenteeBookings;
