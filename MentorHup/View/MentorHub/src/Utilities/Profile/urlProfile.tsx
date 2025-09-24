const API_URL_DEVELOPMENT = "/api/Profile";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api/Profile";

const development = {
  MY_PROFILE: `${API_URL_DEVELOPMENT}/my-profile`,
};

const production = {
  MY_PROFILE: `${API_URL_PRODUCTION}/my-profile`,
};

const urlProfile =
  import.meta.env.MODE === "development" ? development : production;

export default urlProfile;
