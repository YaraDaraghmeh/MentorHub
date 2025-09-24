const API_URL_DEVELOPMENT = "/api";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api";

const ENDPOINT = {
  NOTIFICATION: "notifications",
  DELETE_ALL_NOTIFIC: "all",
};

const development = {
  NOTIFICATION: `${API_URL_DEVELOPMENT}/${ENDPOINT.NOTIFICATION}`,
  DELETE_ALL_NOTIFICATIONS: `${API_URL_DEVELOPMENT}/${ENDPOINT.NOTIFICATION}/${ENDPOINT.DELETE_ALL_NOTIFIC}`,
  UNREAD_COUT: `${API_URL_DEVELOPMENT}/${ENDPOINT.NOTIFICATION}/unread-count`,
};

const production = {
  NOTIFICATION: `${API_URL_PRODUCTION}/${ENDPOINT.NOTIFICATION}`,
  DELETE_ALL_NOTIFICATIONS: `${API_URL_PRODUCTION}/${ENDPOINT.DELETE_ALL_NOTIFIC}`,
  UNREAD_COUT: `${API_URL_PRODUCTION}/${ENDPOINT.NOTIFICATION}/unread-count`,
};

const urlNotification =
  import.meta.env.MODE === "development" ? development : production;

export default urlNotification;
