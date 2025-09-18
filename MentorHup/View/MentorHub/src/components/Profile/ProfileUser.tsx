import { useState } from "react";
import profile from "../../assets/avatar-profile.png";
import { FaCamera } from "react-icons/fa6";
import { useTheme } from "../../Context/ThemeContext";
import bg from "../../assets/bg-profile-withoutShap.png";
import { RxDotFilled } from "react-icons/rx";

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
  const [userData, setUserData] = useState<user[]>([]);

  const { isDark } = useTheme();

  return (
    <>
      <div>
        {/* background + picture */}
        <div className="relative w-full h-38">
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
            <div className="absolute bg-gray-400 top-[87px] left-[90px] p-2 rounded-full">
              <FaCamera className="text-md" />
            </div>
          </div>
        </div>

        {/* body profile */}
        <div
          className={`flex flex-col mt-3 rounded-md p-3 ${
            isDark ? "bg-[var(--primary)]" : "bg-[var(--secondary-light)]"
          }`}
        >
          {/* header */}
          <div className="flex flex-col ">
            {/* role user */}
            <div className="flex justify-end">
              <span
                className={`py-1 px-4 mx-2 rounded-full flex flex-col justify-center items-center border-1 ${
                  isDark
                    ? "border-gray-600 bg-[var(--Philippine)]"
                    : "border-black bg-[var(--primay)]"
                }`}
              >
                Mentee
              </span>
            </div>

            {/* info basic */}
            <div className="flex flex-col p-2 gap-2">
              {/* name & active */}
              <div className="flex flex-row gap-3">
                <h1
                  className={`flex-col text-semibold text-lg ${
                    isDark ? "text-white" : "text-[var(--primary)]"
                  }`}
                >
                  Sara Sayed Ahmad
                </h1>
                <span
                  className={`flex flex-row justify-center items-center rounded-md px-1 border-2 gap-0 ${
                    isDark ? "border-[#3a403d]" : "border-gray-400"
                  }`}
                >
                  <RxDotFilled className="text-[#008a45] text-lg" />
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-[var(--secondary)]"
                        : "text-[var(--primary)]"
                    }`}
                  >
                    Active
                  </p>
                </span>
              </div>

              {/* email */}
              <p
                className={`flex flex-start ${
                  isDark ? "text-gray-400" : `text-[var(--primary-light)]`
                }`}
              >
                sara.ahmad@gmail.com
              </p>
            </div>

            {/* labels */}
            <div className="flex flex-row py-3">
              <div className="flex flex-col p-2 gap-2 text-start">
                <h3
                  className={`text-sm ${
                    isDark
                      ? "text-[var(--aqua-green)]"
                      : "text-[var(--primary-light)]"
                  }`}
                >
                  Created
                </h3>
                <span
                  className={`${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--primary-light)]"
                  }`}
                >
                  12/3/2025
                </span>
              </div>
              <div
                className={`border border-r-1 h-14 m-2  ${
                  isDark ? "border-[#383e4085]" : "border-black"
                }`}
              ></div>
              <div className="flex flex-col p-2 gap-2 text-start">
                <h3
                  className={`text-sm ${
                    isDark
                      ? "text-[var(--aqua-green)]"
                      : "text-[var(--primary-light)]"
                  }`}
                >
                  Sessions
                </h3>
                <span
                  className={`text-center ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--primary-light)]"
                  }`}
                >
                  0
                </span>
              </div>
            </div>
          </div>

          <hr
            className={`${
              isDark ? "text-[#383e4085]" : "text-[var(--primary)]"
            }`}
          ></hr>

          {/* information user */}
          <div
            className={`flex flex-col py-2 ${
              isDark ? "text-white" : "text-[var(--primary)]"
            }`}
          >
            <div className="px-3 py-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <h4 className="col-span-1 text-start">Name</h4>
                <h5 className="col-span-1 text-start">Sara Sayed Ahmad</h5>
              </div>
              <hr
                className={`${
                  isDark ? "text-[#282d2e85]" : "text-[var(--primary)]"
                }`}
              ></hr>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <h4 className="col-span-1 text-start">Gender</h4>
                <h5 className="col-span-1 text-start">Female</h5>
              </div>
              <hr
                className={`${
                  isDark ? "text-[#282d2e85]" : "text-[var(--primary)]"
                }`}
              ></hr>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <h4 className="col-span-1 text-start">Email</h4>
                <h5 className="col-span-1 text-start">
                  sarasayedahmad24@gmail.com
                </h5>
              </div>
              <hr
                className={`${
                  isDark ? "text-[#282d2e85]" : "text-[var(--primary)]"
                }`}
              ></hr>
            </div>
          </div>

          {/* Edit profile */}
          <div className="flex flex-row gap-3 justify-end items-center px-3">
            <button
              className={`text-end border-1 py-2 px-3 rounded-md ${
                isDark
                  ? "text-[var(--secondary)] bg-[var(--primary-dark)] border-[var(--gray-medium)]"
                  : "bg-[var(--primary-dark)]"
              }`}
            >
              Edit Profile
            </button>
            <button
              className={`text-end border-1 py-2 px-3 rounded-md ${
                isDark
                  ? "text-[var(--secondary)] bg-[var(--primary-dark)] border-[var(--gray-medium)]"
                  : "bg-[var(--primary-dark)]"
              }`}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUser;
