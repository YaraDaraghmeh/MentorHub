import { useEffect, useState } from "react";
import profile from "../../assets/avatar-profile.png";
import { FaCamera } from "react-icons/fa6";
import { useTheme } from "../../Context/ThemeContext";
import bg from "../../assets/bg-profile-shape.png";
import { RxDotFilled } from "react-icons/rx";
import axios from "axios";

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

interface propsProfile {
  open: boolean;
  user: string;
  onClose: () => void;
}

const ModalProfile = ({ open, user, onClose }: propsProfile) => {
  const [userData, setUserData] = useState<user[]>([]);
  const { isDark } = useTheme();

  console.log("user: ", user);
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.log("Not Authorized");
  }

  //   useEffect(() =>{
  //     const getProfile = async () =>{
  //     try{

  //         cosnt res = await axios.get()
  //         }
  //     }
  //   },[]);

  return (
    <>
      {open && (
        <div className="flex items-center justify-center">
          {/* background */}
          <div className="fixed inset-0 bg-black/50 z-86" onClick={onClose} />
          <div
            className={`flex-col fixed top-3 bottom-3 z-100 w-60 lg:w-[600px] h-auto shadow-2xl rounded w-full ${
              isDark ? "shadow-[#7e827e] bg-[var(--primary)]" : "bg-white"
            }`}
          >
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
                <div className="absolute bg-gray-300 top-[87px] left-[90px] p-2 rounded-full">
                  <FaCamera className="text-md text-[var(--primary-light)]" />
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
              <div className="flex flex-col">
                {/* role user */}
                <div className="flex justify-end">
                  <span
                    className={`py-1 px-4 mx-2 rounded-full flex flex-col justify-center items-center border-1 ${
                      isDark
                        ? "border-gray-600 text-[var(--primary)] bg-[var(--Philippine)]"
                        : "border-gray-400 text-[var(--secondary-light)] bg-[var(--primary)]"
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
                      className={`flex-col font-bold text-lg ${
                        isDark ? "text-white" : "text-[var(--primary)]"
                      }`}
                    >
                      Sara Sayed Ahmad
                    </h1>
                    <span
                      className={`flex flex-row justify-center items-center rounded-md px-1 border-2 gap-0 ${
                        isDark ? "border-[#3a403d]" : "border-gray-300"
                      }`}
                    >
                      <RxDotFilled className="text-[#008a45] text-lg" />
                      <p
                        className={`text-sm ${
                          isDark
                            ? "text-[var(--secondary)]"
                            : "text-[var(--gray-dark)]"
                        }`}
                      >
                        Active
                      </p>
                    </span>
                  </div>

                  {/* email */}
                  <p
                    className={`flex flex-start ${
                      isDark ? "text-gray-400" : `text-[var(--gray-medium)]`
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
                          : "text-[var(--gray-medium)]"
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
                      isDark ? "border-[#383e4085]" : "border-[#8e999d85]"
                    }`}
                  ></div>
                  <div className="flex flex-col p-2 gap-2 text-start">
                    <h3
                      className={`text-sm ${
                        isDark
                          ? "text-[var(--aqua-green)]"
                          : "text-[var(--gray-medium)]"
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
                  isDark ? "text-[#383e4085]" : "text-[#8e999d85]"
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
                    <h4 className="col-span-1 text-start font-semibold">
                      Name
                    </h4>
                    <h5 className="col-span-1 text-start">Sara Sayed Ahmad</h5>
                  </div>
                  <hr
                    className={`${
                      isDark ? "text-[#282d2e85]" : "text-[#8e999d85]"
                    }`}
                  ></hr>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <h4 className="col-span-1 text-start font-semibold">
                      Gender
                    </h4>
                    <h5 className="col-span-1 text-start">Female</h5>
                  </div>
                  <hr
                    className={`${
                      isDark ? "text-[#282d2e85]" : "text-[#8e999d85]"
                    }`}
                  ></hr>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <h4 className="col-span-1 text-start font-semibold">
                      Email
                    </h4>
                    <h5 className="col-span-1 text-start">
                      sarasayedahmad24@gmail.com
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalProfile;
