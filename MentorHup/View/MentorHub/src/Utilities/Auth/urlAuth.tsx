const API_URL_DEVELOPMENT = "/api/auth";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/auth";

const ENDPOINT = {
  LOGIN: "login",
  LOGOUT: "logout",
  GOOGLE_LOGIN: "login/google",
};

const development = {
  LOGIN_USER: `${API_URL_DEVELOPMENT}/${ENDPOINT.LOGIN}`,
  LOGOUT_USER: `${API_URL_DEVELOPMENT}/${ENDPOINT.LOGOUT}`,
  GOOGLE_LOGIN: `${API_URL_DEVELOPMENT}/${ENDPOINT.GOOGLE_LOGIN}`,
};

const production = {
  LOGIN_USER: `${API_URL_PRODUCTION}/${ENDPOINT.LOGIN}`,
  LOGOUT_USER: `${API_URL_PRODUCTION}/${ENDPOINT.LOGOUT}`,
  GOOGLE_LOGIN: `${API_URL_PRODUCTION}/${ENDPOINT.GOOGLE_LOGIN}`,
};

const urlAuth =
  import.meta.env.MODE === "development" ? development : production;

export default urlAuth;
