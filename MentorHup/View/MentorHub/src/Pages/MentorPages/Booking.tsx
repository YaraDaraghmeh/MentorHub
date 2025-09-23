import TableBooking from "../../components/Tables/tableBooking";
import CalendarBook from "../../components/Calendar/CalendarBooking";

const Booking = () => {
  const userName = localStorage.getItem("userName");

  return (
    <>
      <CalendarBook userType="mentor" user={userName!} />
      <TableBooking />
    </>
  );
};

export default Booking;
