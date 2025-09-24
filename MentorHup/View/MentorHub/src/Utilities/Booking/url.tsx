const API_URL_DEVELOPMENT = "/api/bookings";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/bookings";

const development = {
  GET_BOOKINGS: `${API_URL_DEVELOPMENT}`,
};

const production = {
  GET_BOOKINGS: `${API_URL_PRODUCTION}`,
};

const urlBooking =
  import.meta.env.MODE === "development" ? development : production;

export default urlBooking;
