const API_BASE_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/mentors";

// In development, route through Vite dev server proxy to avoid CORS
const API_BASE_URL_DEV_PROXY = "/api/mentors";

const ENDPOINT = {
  REGISTER: "register",
};

const development = {
  REGISTER_USER: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.REGISTER}`,
};

const production = {
  REGISTER_USER: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.REGISTER}`,
};

const urlMentor =
  import.meta.env.MODE === "development" ? development : production;

export default urlMentor;
