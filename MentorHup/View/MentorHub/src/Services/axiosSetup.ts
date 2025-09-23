import axios from "axios";
import { getAccessToken } from "./AuthToken";

axios.interceptors.request.use(async (config) =>{
    const token = await getAccessToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;