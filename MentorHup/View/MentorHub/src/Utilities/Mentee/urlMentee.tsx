const API_BEST_URL_DEVELOPMENT = "/api/mentees";
const API_BEST_URL_PRODUCTION = "http://appname.azurewebsite.net";

const ENDPOINT = {
  REGISTER: "register",
};

const development = {
  REGISTER_USER: `${API_BEST_URL_DEVELOPMENT}/${ENDPOINT.REGISTER}`,
};

const production = {
  REGISTER_USER: `${API_BEST_URL_PRODUCTION}/${ENDPOINT.REGISTER}`,
};

const urlMentee =
  import.meta.env.MODE === "development" ? development : production;

export default urlMentee;
