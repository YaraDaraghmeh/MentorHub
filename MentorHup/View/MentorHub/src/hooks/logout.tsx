import axios from "axios";
import urlAuth from "../Utilities/Auth/urlAuth";

export const Logout = async () => {
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token || !refreshToken) {
    console.warn("No token or refreshToken found");
    return;
  }

  try {
    const res = await axios.post(
      urlAuth.LOGOUT_USER,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data);
  } catch (error: any) {
    console.log("Logout error: ", error);
    return [];
  }
};
