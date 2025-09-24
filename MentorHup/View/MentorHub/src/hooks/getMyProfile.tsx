import axios from "axios";
import urlProfile from "../Utilities/Profile/urlProfile";

export const GetMyProfile = async () => {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await axios.get(urlProfile.MY_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    console.log("Get My Profile: ", error);
    return [];
  }
};
