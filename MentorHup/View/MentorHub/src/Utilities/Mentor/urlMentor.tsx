const API_BASE_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/mentors";

// In development, route through Vite dev server proxy to avoid CORS
const API_BASE_URL_DEV_PROXY = "/api/mentors";

const ENDPOINT = {
  REGISTER: "register",
  DASHBOARD: "dashboard",
};

const development = {
  GET_ALL_MENTORS: API_BASE_URL_DEV_PROXY,
  REGISTER_USER: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.REGISTER}`,
  MENTOR_DASHBOARD: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.DASHBOARD}`,
};

const production = {
  GET_ALL_MENTORS: API_BASE_URL_PRODUCTION,
  REGISTER_USER: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.REGISTER}`,
  MENTOR_DASHBOARD: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.DASHBOARD}`,
};

// More robust environment detection
const isDevelopment =
  import.meta.env.MODE === "development" || import.meta.env.DEV;
const urlMentor = isDevelopment ? development : production;

console.log("🔧 URL Config: Environment mode:", import.meta.env.MODE);
console.log("🔧 URL Config: Is development:", isDevelopment);
console.log("🔧 URL Config: Using URLs:", urlMentor);

export default urlMentor;
