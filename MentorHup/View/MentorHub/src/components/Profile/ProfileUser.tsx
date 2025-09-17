import { useState } from "react";
import profile from "../../assets/avatar-profile.png";
import { FaCamera } from "react-icons/fa6";
import { useTheme } from "../../Context/ThemeContext";
import bg from "../../assets/bg-profile.jpg";

interface user {
  name: string;
  role: string;
  email: string;
  gender: string;
  password: string;
  created: string;
  numBooking?: number;
  experience: number;
  skills: [];
  imageLinke?: string;
}

const ProfileUser = () => {
  //   const [userData, setUserData] = useState<user[]>([]);
  const { isDark } = useTheme();

  return (
    <>
      <div>
        {/* background + picture */}
        <div className="relative w-full h-40">
          <div
            className="absolute rounded-md inset-0 "
            style={{
              background: `url(${bg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          <div className="relative top-[77px] left-12 z-12 rounded-full border-4 border-white w-32 h-32">
            <img src={profile} alt={profile} className="w-full h-full" />
            <FaCamera className="abosolute" />
          </div>
        </div>

        {/* body profile */}
        <div
          className={`flex flex-col mt-3 ${
            isDark ? "bg-[var(--primary)]" : "bg-[var(--secondary-light)]"
          }`}
        >
          <span
            className={`p-2 flex flex-col justify-center items-center border-2 ${
              isDark
                ? "border-gray-400 bg-[var(--green-dark)]"
                : "border-black bg-[var(--primay)]"
            }`}
          >
            Mentee
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileUser;
