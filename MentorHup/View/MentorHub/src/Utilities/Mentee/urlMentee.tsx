const API_BEST_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/mentees";

// In development, route through Vite dev server proxy to avoid CORS
const API_BEST_URL_DEV_PROXY = "/api/mentees";

const ENDPOINT = {
  REGISTER: "register",
  DASHBARD: "dashboard-stats",
};

const development = {
  // Use the proxy base during local development
  REGISTER_USER: `${API_BEST_URL_DEV_PROXY}/${ENDPOINT.REGISTER}`,
  DASHBOARD: `${API_BEST_URL_DEV_PROXY}/${ENDPOINT.DASHBARD}`,
};

const production = {
  REGISTER_USER: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.REGISTER}`,
  DASHBOARD: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.DASHBARD}`,
};

const urlMentee =
  import.meta.env.MODE === "development" ? development : production;

export default urlMentee;
