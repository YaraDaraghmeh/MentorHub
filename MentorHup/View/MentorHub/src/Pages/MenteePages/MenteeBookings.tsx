
import CalendarBook from "../../components/Calendar/CalendarBooing";
import MenteeTableBooking from "../../components/Tables/MenteeTableBooking";

const MenteeBookings = () => {
    
  
  return (
    <>
      <CalendarBook />
      {/* Table Sessions */}
      <div className="py-7 w-full">
        <MenteeTableBooking />
      </div>
    </>
  );
};

export default MenteeBookings;
