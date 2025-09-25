import { useEffect, useState } from "react";
import profile from "../../assets/avatar-profile.png";
import { useTheme } from "../../Context/ThemeContext";
import bg from "../../assets/bg-profile-shape.png";
import { RxDotFilled } from "react-icons/rx";
import { BasicInfo } from "./basicInfo";
import { GetMyProfile } from "../../hooks/getMyProfile";
import { LabelsInfo } from "./LabelInfo";
import { FaCamera } from "react-icons/fa6";
import FormateDate from "../Tables/date";
import axios from "axios";
import urlMentee from "../../Utilities/Mentee/urlMentee";
import ModalOk from "../Modal/ModalOk";
import Alert from "../Tables/alerts";
import ModalChangePassword from "../Modal/ModalChangePassword";
import { useAuth } from "../../Context/AuthContext";
import { ChangePassword } from "../../hooks/changePassword";

interface user {
  applicationUserId: string;
  email: string;
  userName: string;
  imageLink: string | null;
  gender: string;
  role: string;
  createdAt: string;
}

const ProfileUser = () => {
  const [userData, setUserData] = useState<user>({
    applicationUserId: "",
    email: "",
    userName: "",
    imageLink: null,
    gender: "",
    role: "",
    createdAt: "",
  });
  const { isDark } = useTheme();
  const token = localStorage.getItem("accessToken");
  const [mentee, setMentee] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [changeInfo, setChangeInfo] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [successChange, setSuccessChange] = useState(false);
  const [logoutNow, setLogoutNow] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const getInfo = async () => {
      const data = await GetMyProfile();
      setUserData(data);
    };

    getInfo();

    // count booking for mentee
    const getCompletedSessions = async () => {
      try {
        const res = await axios.get(urlMentee.DASHBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMentee(res.data.completedSessions);
      } catch (error: any) {
        console.log("completedSessions error: ", error);
      }
    };

    getCompletedSessions();
  }, []);

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const selectedFile = e.target.files[0];
  //     setFile(selectedFile);

  //     const formData = new FormData();
  //     formData.append("Image", selectedFile);

  //     try {
  //       const res = await axios.post(urlMentor.UPLOADIMG, formData, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const newImageLink = res.data.imageLink;
  //       setUserData((prev) => ({ ...prev, imageLink: newImageLink }));
  //     } catch (err) {
  //       console.error("Upload failed:", err);
  //     }
  //   }
  // };

  const handleChangePassword = () => {
    setChangePassword(true);
  };

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
            <img
              src={userData?.imageLink || profile}
              alt={profile}
              className="w-full h-full"
            />
            {userData.role !== "Admin" && (
              <div className="absolute bg-gray-300 top-[87px] left-[90px] p-2 rounded-full">
                <label htmlFor="fileInput">
                  <FaCamera className="text-md text-[var(--primary-light)] cursor-pointer" />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  // onChange={handleFileChange}
                />
              </div>
            )}
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
                    ? "border-gray-600 text-[var(--primary)] bg-[var(--Philippine)]"
                    : "border-gray-400 text-[var(--secondary-light)] bg-[var(--primary)]"
                }`}
              >
                {userData.role}
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
                  {userData.userName}
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
                {userData.email}
              </p>
            </div>

            {/* labels */}
            <div className="flex flex-row py-3">
              <BasicInfo
                role={userData.role}
                createdAt={FormateDate(userData.createdAt)}
                sessions={mentee}
              />
            </div>
          </div>

          <hr
            className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
          ></hr>

          {/* information user */}
          <div
            className={`flex flex-col py-2 ${
              isDark ? "text-white" : "text-[var(--primary)]"
            }`}
          >
            {userData && (
              <div className="px-3 py-2">
                <LabelsInfo label="Name" value={userData.userName} />
                <LabelsInfo label="Email" value={userData.email} />

                {userData.role !== "Admin" && (
                  <LabelsInfo label="Gender" value={userData.gender} />
                )}
              </div>
            )}
          </div>

          {/* Edit profile */}
          <div className="flex flex-row gap-3 justify-end items-center px-3">
            {userData.role !== "Admin" && (
              <button
                className={`text-end border-1 py-2 px-3 rounded-md border-[var(--gray-medium)] ${
                  isDark
                    ? "text-[var(--secondary)] bg-[var(--primary-dark)]"
                    : "text-[var(--secondary-light)] bg-[var(--primary)]"
                }`}
              >
                Edit Profile
              </button>
            )}
            <button
              className={`text-end border-1 py-2 px-3 rounded-md ${
                isDark
                  ? "text-[var(--secondary)] bg-[var(--primary-dark)] border-[var(--gray-medium)]"
                  : "text-[var(--secondary-light)] bg-[var(--primary)]"
              }`}
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Modal Change Password */}
      <ModalChangePassword
        open={changePassword}
        onClose={() => setChangePassword(false)}
        title="Change Password"
        onConfirm={async () => {
          try {
            const resp = await ChangePassword(changeInfo);

            if (resp === 200) {
              setChangePassword(false);
              setSuccessChange(true);
              setLogoutNow(true);
            }
          } catch (err: any) {
            console.log("error change password: ", err);
          }
        }}
      >
        <div className="flex flex-col w-full justify-between items-start gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label
              className={`text-start justify-center text-base font-medium ${
                isDark ? "text-gray-200" : "text-[var(--primary)]"
              }`}
            >
              Current Password
            </label>
            <input
              value={changeInfo.currentPassword}
              onChange={(e) =>
                setChangeInfo({
                  ...changeInfo,
                  currentPassword: e.target.value,
                })
              }
              name="currentPassword"
              type="password"
              placeholder="**********"
              className={`flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 w-full border-1 bg-gray-100 border-[var(--System-Gray-300)] }`}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label
              className={`text-start justify-center text-base font-medium ${
                isDark ? "text-gray-200" : "text-[var(--primary)]"
              }`}
            >
              New Password
            </label>
            <input
              onChange={(e) =>
                setChangeInfo({ ...changeInfo, newPassword: e.target.value })
              }
              value={changeInfo.newPassword}
              name="NewPassword"
              type="password"
              placeholder="**********"
              className={`flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 w-full border-1 bg-gray-100 border-[var(--System-Gray-300)] }`}
            />
          </div>
        </div>
      </ModalChangePassword>

      {/* alert success */}
      <Alert
        open={successChange}
        type="success"
        message="Password changed successfully!"
      />

      {/* logout */}
      <ModalOk
        open={logoutNow}
        title="Logout"
        message="Please log out and log in again to continue."
        onConfirm={logout}
      />
    </>
  );
};

export default ProfileUser;
