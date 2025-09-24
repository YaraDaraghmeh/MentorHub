const API_URL_DEVELOPMENT = "/api/dashboard";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/dashboard";

const ENDPOINT = {
  BOOKING_PER_WEEK: "weekly-bookings",
};

const development = {
  BOOKING_PER_WEEK: `${API_URL_DEVELOPMENT}/${ENDPOINT.BOOKING_PER_WEEK}`,
};

const production = {
  BOOKING_PER_WEEK: `${API_URL_PRODUCTION}/${ENDPOINT.BOOKING_PER_WEEK}`,
};

const urlDashboard =
  import.meta.env.MODE === "development" ? development : production;

export default urlDashboard;
