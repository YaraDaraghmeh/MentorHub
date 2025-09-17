const API_URL_DEVELOPMENT = "/api";
const API_URL_PRODUCTION = "https://mentor-hub.runasp.net/api";

const ENDPOINT = {
  SKILLS: "Skills",
  ADD_SKILLS: "add-skill",
};

const development = {
  SKILLS: `${API_URL_DEVELOPMENT}/${ENDPOINT.SKILLS}`,
  ADD_SKILLS: `${API_URL_DEVELOPMENT}/${ENDPOINT.SKILLS}/${ENDPOINT.ADD_SKILLS}`,
};

const production = {
  SKILLS: `${API_URL_PRODUCTION}/${ENDPOINT.SKILLS}`,
  ADD_SKILLS: `${API_URL_PRODUCTION}/${ENDPOINT.SKILLS}/${ENDPOINT.ADD_SKILLS}`,
};

const urlSkills =
  import.meta.env.MODE === "development" ? development : production;

export default urlSkills;
