const API_BASE_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/mentors";

// In development, route through Vite dev server proxy to avoid CORS
const API_BASE_URL_DEV_PROXY = "/api/mentors";

const ENDPOINT = {
  REGISTER: "register",
  DASHBOARD: "dashboard",
  UPLOAD: "upload-image",
  ADD_AVAILABILITY: "add-availability",
  UPLOAD_CV: "upload-cv",
  EDIT_PROFILE: "edit",
};

const development = {
  GET_ALL_MENTORS: API_BASE_URL_DEV_PROXY,
  REGISTER_USER: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.REGISTER}`,
  MENTOR_DASHBOARD: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.DASHBOARD}`,
  UPLOADIMG: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.UPLOAD}`,
  UPLOAD_CV: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.UPLOAD_CV}`,
  ADD_AVAILABILTY: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.ADD_AVAILABILITY}`,
  EDIT_PROFILE: `${API_BASE_URL_DEV_PROXY}/${ENDPOINT.EDIT_PROFILE}`,
};

const production = {
  GET_ALL_MENTORS: API_BASE_URL_PRODUCTION,
  REGISTER_USER: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.REGISTER}`,
  MENTOR_DASHBOARD: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.DASHBOARD}`,
  UPLOADIMG: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.UPLOAD}`,
  UPLOAD_CV: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.UPLOAD_CV}`,
  ADD_AVAILABILTY: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.ADD_AVAILABILITY}`,
  EDIT_PROFILE: `${API_BASE_URL_PRODUCTION}/${ENDPOINT.EDIT_PROFILE}`,
};

// More robust environment detection
const isDevelopment =
  import.meta.env.MODE === "development" || import.meta.env.DEV;
const urlMentor = isDevelopment ? development : production;

console.log("🔧 URL Config: Environment mode:", import.meta.env.MODE);
console.log("🔧 URL Config: Is development:", isDevelopment);
console.log("🔧 URL Config: Using URLs:", urlMentor);

export default urlMentor;
