const API_URL_DEVELOPMENT = "/api/Admin";
const API_BEST_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/Admin";

const ENDPOINT = {
  GET_MENTORS: "mentors",
  GET_MENTEES: "mentees",
  STATISTICS: "dashboard-stats",
  USER: "all-users",
  USERSAC: "users",
};

const development = {
  GET_MENTOR: `${API_URL_DEVELOPMENT}/${ENDPOINT.GET_MENTORS}`,
  GET_MENTEE: `${API_URL_DEVELOPMENT}/${ENDPOINT.GET_MENTEES}`,
  GET_STATISTICS: `${API_URL_DEVELOPMENT}/${ENDPOINT.STATISTICS}`,
  USERS: `${API_URL_DEVELOPMENT}/${ENDPOINT.USER}`,
  USERSAC: `${API_URL_DEVELOPMENT}/${ENDPOINT.USERSAC}`,
};

const production = {
  GET_MENTOR: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.GET_MENTORS}`,
  GET_MENTEE: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.GET_MENTEES}`,
  GET_STATISTICS: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.STATISTICS}`,
  USERS: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.USER}`,
  USERSAC: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.USERSAC}`,
};

const urlAdmin =
  import.meta.env.MODE === "development" ? development : production;

export default urlAdmin;
