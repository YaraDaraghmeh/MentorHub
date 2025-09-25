import CalendarBook from "../../components/Calendar/CalendarBooking";
import MentorTableBooking from "../../components/Tables/tableBooking";

const Booking = () => {
  const userName = localStorage.getItem("userName");

  return (
    <>
      <CalendarBook userType="mentor" user={userName!} />
      <MentorTableBooking />
    </>
  );
};

export default Booking;
