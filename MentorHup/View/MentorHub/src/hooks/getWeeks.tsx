import axios from "axios";
import urlDashboard from "../Utilities/Dashboard/urlDashboard";

export const GetBookingPerWeek = async () => {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await axios.get(urlDashboard.BOOKING_PER_WEEK, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.log("Error fetching statistics:", error);
    return [];
  }
};
