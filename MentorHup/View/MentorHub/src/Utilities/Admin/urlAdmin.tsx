const API_URL_DEVELOPMENT = "/api/Admin";
const API_URL_PRODUCTION = "http://appname.azurewebsite.net";

const ENDPOINT = {
  GET_MENTORS: "mentors",
  GET_MENTEES: "mentees",
  STATISTICS: "dashboard-stats",
  USER: "users",
};

const development = {
  GET_MENTOR: `${API_URL_DEVELOPMENT}/${ENDPOINT.GET_MENTORS}`,
  GET_MENTEE: `${API_URL_DEVELOPMENT}/${ENDPOINT.GET_MENTEES}`,
  GET_STATISTICS: `${API_URL_DEVELOPMENT}/${ENDPOINT.STATISTICS}`,
  USERS: `${API_URL_DEVELOPMENT}/${ENDPOINT.USER}`,
};

const production = {
  GET_MENTOR: `${API_URL_PRODUCTION}/${ENDPOINT.GET_MENTORS}`,
  GET_MENTEE: `${API_URL_PRODUCTION}/${ENDPOINT.GET_MENTEES}`,
  GET_STATISTICS: `${API_URL_PRODUCTION}/${ENDPOINT.STATISTICS}`,
  USERS: `${API_URL_PRODUCTION}/${ENDPOINT.USER}`,
};

const urlAdmin =
  import.meta.env.MODE === "development" ? development : production;

export default urlAdmin;
