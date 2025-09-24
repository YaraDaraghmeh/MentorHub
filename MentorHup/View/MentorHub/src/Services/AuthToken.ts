import axios from "axios";

let accessToken: string | null;
let refreshToken: string | null;

// storage tokens
export const setToken = (tokens: {access: string; refresh: string}) => {
    accessToken = tokens.access;
    refreshToken = tokens.refresh;
}

export const getAccessToken = async (): Promise<string | null> => {
    if (!accessToken) throw new Error("No access token available");

    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const isExpired = Date.now() >= payload.exp * 1000;

    if(isExpired){
        console.log("Access token expired, refreshing...");

        const resp = await axios.post("https://mentor-hub.runasp.net/api/auth/refresh", {
           refreshToken
        });

        if(resp.status === 200) throw new Error("Failed to refresh token");

        accessToken = resp.data.accessToken;
        refreshToken = resp.data.refreshToken;
    }

    return accessToken;
}

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};