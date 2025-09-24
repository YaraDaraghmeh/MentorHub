const API_URL_DEVELOPMENT = "/api";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api";

const ENDPOINT = {
  GET_ALL_REVIEWS: "all-reviews",
  REVIEW: "reviews",
  REVIEW_MENTOR: "mentor", //for mentor by id
};

const development = {
  GET_ALL_REVIEWS: `${API_URL_DEVELOPMENT}/${ENDPOINT.REVIEW}/${ENDPOINT.GET_ALL_REVIEWS}`,
  //   GET_MENTEE: `${API_URL_DEVELOPMENT}/${ENDPOINT.GET_MENTEES}`,
  //   GET_STATISTICS: `${API_URL_DEVELOPMENT}/${ENDPOINT.STATISTICS}`,
  //   USERS: `${API_URL_DEVELOPMENT}/${ENDPOINT.USER}`,
  //   USERSAC: `${API_URL_DEVELOPMENT}/${ENDPOINT.USERSAC}`,
};

const production = {
  GET_ALL_REVIEWS: `${API_URL_PRODUCTION}/${ENDPOINT.REVIEW}/${ENDPOINT.GET_ALL_REVIEWS}`,
  //   GET_MENTEE: `${API_URL_PRODUCTION}/${ENDPOINT.GET_MENTEES}`,
  //   GET_STATISTICS: `${API_URL_PRODUCTION}/${ENDPOINT.STATISTICS}`,
  //   USERS: `${API_URL_PRODUCTION}/${ENDPOINT.USER}`,
  //   USERSAC: `${API_URL_PRODUCTION}/${ENDPOINT.USERSAC}`,
};

const urlReview =
  import.meta.env.MODE === "development" ? development : production;

export default urlReview;
