import axios from "axios";
import urlAuth from "../Utilities/Auth/urlAuth";

interface changePassword {
  currentPassword: string;
  newPassword: string;
}

export const ChangePassword = async (info: changePassword) => {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await axios.post(urlAuth.CHANGE_PASSWORD, info, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.status;
  } catch (error: any) {
    console.log("Change password error: ", error);
    return [];
  }
};
