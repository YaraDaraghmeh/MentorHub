const API_URL_DEVELOPMENT = "/api";
const API_URL_PRODUCTION = "http://appname.azurewebsite.net";

const ENDPOINT = {
  GET_ALL_CHATTING: "conversations",
  MESSAGES: "messages",
};

const development = {
  GET_ALL_CONVERSATION: `${API_URL_DEVELOPMENT}/${ENDPOINT.MESSAGES}/${ENDPOINT.GET_ALL_CHATTING}`,
  GET_MESSAGE: `${API_URL_DEVELOPMENT}/${ENDPOINT.MESSAGES}`,
};

const production = {
  GET_ALL_CONVERSATION: `${API_URL_PRODUCTION}/${ENDPOINT.MESSAGES}/${ENDPOINT.GET_ALL_CHATTING}`,
  GET_MESSAGE: `${API_URL_PRODUCTION}/${ENDPOINT.MESSAGES}`,
};

const urlChatting =
  import.meta.env.MODE === "development" ? development : production;

export default urlChatting;
