import axios from "axios";
import urlBooking from "../Utilities/Booking/url";

export const CancelBooking = async (bookingId: number) => {
  const token = localStorage.getItem("accessToken");
  console.log(bookingId);
  try {
    const res = await axios.post(
      `${urlBooking.GET_BOOKINGS}/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.status;
  } catch (error: any) {
    console.log("Cancel Booking: ", error);
    return [];
  }
};
