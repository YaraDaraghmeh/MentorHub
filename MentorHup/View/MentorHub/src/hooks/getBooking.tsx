import axios from "axios";
import urlBooking from "../Utilities/Booking/url";

export const GetBooking = async () => {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await axios.get(urlBooking.GET_BOOKINGS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.items;
  } catch (error: any) {
    console.log("Get booking: ", error);
    return [];
  }
};
