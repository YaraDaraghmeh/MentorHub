import { useEffect, useState } from "react";
import profile from "../../assets/avatar-profile.png";
import { useTheme } from "../../Context/ThemeContext";
import bg from "../../assets/bg-profile-shape.png";
import { RxDotFilled } from "react-icons/rx";
import { BasicInfo } from "./basicInfo";
import { GetMyProfile } from "../../hooks/getMyProfile";
import { FaCamera } from "react-icons/fa6";
import FormateDate from "../Tables/date";
import axios from "axios";
import urlMentor from "../../Utilities/Mentor/urlMentor";
import { day, time } from "./FormateAvaila";
import { MdOutlineAdd } from "react-icons/md";
import ModalChangePassword from "../Modal/ModalChangePassword";
import { ChangePassword } from "../../hooks/changePassword";

interface user {
  applicationUserId: string;
  email: string;
  name: string;
  imageLink: string | null;
  companyName: string;
  role: string;
  createdAt: string;
  description: string;
  experiences: number;
  field: string;
  cvLink: string;
  skills: [];
  price: number;
  availabilites: [
    {
      mentorAvailabilityId: number;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      durationInMinutes: number;
      isBooked: boolean;
    }
  ];
  reviewsCount: [];
}

const ProfMentor = () => {
  const [userData, setUserData] = useState<user>({
    applicationUserId: "",
    email: "",
    name: "",
    imageLink: "",
    companyName: "",
    cvLink: "",
    role: "",
    createdAt: "",
    description: "",
    experiences: 0,
    price: 0,
    field: "",
    skills: [],
    availabilites: [
      {
        mentorAvailabilityId: 0,
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        durationInMinutes: 0,
        isBooked: false,
      },
    ],
    reviewsCount: [],
  });
  const { isDark } = useTheme();
  const token = localStorage.getItem("accessToken");
  const [mentor, setMentor] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [changeData, setChangeData] = useState({
    currentPassword: "",
    NewPassword: "",
  });

  useEffect(() => {
    const getInfo = async () => {
      const data = await GetMyProfile();
      setUserData(data);
    };

    getInfo();

    // count booking for mentor
    const getUpcommingSessions = async () => {
      try {
        const res = await axios.get(urlMentor.MENTOR_DASHBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMentor(res.data.upcomingBookings);
      } catch (error: any) {
        console.log("Booking error: ", error);
      }
    };

    getUpcommingSessions();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const formData = new FormData();
      formData.append("Image", selectedFile);

      try {
        const res = await axios.post(urlMentor.UPLOADIMG, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newImageLink = res.data.imageLink;
        setUserData((prev) => ({ ...prev, imageLink: newImageLink }));
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  };

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

          <div className="relative top-[77px] left-12 z-12 w-32 h-32">
            <img
              src={userData.imageLink || profile}
              alt={profile}
              className="rounded-full border-4 border-white w-full h-full"
            />
            <div className="absolute bg-gray-300 top-[87px] left-[90px] p-2 rounded-full">
              <label htmlFor="fileInput">
                <FaCamera className="text-md text-[var(--primary-light)] cursor-pointer" />
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
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
                  {userData.name}
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

              {/* field */}
              <div>
                <h3
                  className={`flex flex-row gap-2 font-semibold text-start ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--teal-950)]"
                  }`}
                >
                  <span className="flex">{userData.field} </span>
                  <span className="flex text-gray-400"> at </span>
                  <span className="flex text-gray-600">
                    {userData.companyName}
                  </span>
                </h3>
              </div>
            </div>

            {/* description */}
            <div className="flex flex-row p-2 justify-between items-center">
              <div className="flex flex-col">
                <p
                  className={`w-160 text-start ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--primary)]"
                  }`}
                >
                  {userData.description}
                </p>
              </div>
              {/* labels */}
              <div className="flex flex-col py-2">
                <div className="flex flex-row">
                  <BasicInfo
                    role={userData.role}
                    createdAt={FormateDate(userData.createdAt)}
                    sessions={mentor}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr
            className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
          ></hr>

          <div
            className={`flex flex-col justify-start items-start py-5 px-2 gap-3`}
          >
            <h2
              className={`text-lg font-semibold ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              Skills
            </h2>
            <div>
              {userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-2 rounded-full text-sm m-2 ${
                    isDark
                      ? "bg-[var(--System-Gray-300)] text-[var(--primary-dark)]"
                      : "bg-[var(--primary-rgba)] text-[var(--secondary-light)]"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <hr
            className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
          ></hr>

          <div className="flex flex-col justify-start items-start py-5 px-2 gap-3">
            <h2
              className={`text-lg font-semibold ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              CV
            </h2>
            <span
              className={`text-xs underline cursor-pointer ${
                isDark
                  ? "text-[var(--System-Gray-300)]"
                  : "text-[var(--green-dark)]"
              }`}
            >
              {userData.cvLink ? (
                <>Download CV</>
              ) : (
                <> Do you want upload CV?</>
              )}
            </span>
          </div>

          <hr
            className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
          ></hr>

          {/* Booking */}
          <div className="flex flex-col justify-start items-start py-5 px-2 gap-3">
            <h2
              className={`text-lg font-semibold ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              Booking
            </h2>
            <span
              className={`text-sm ${
                isDark
                  ? "text-[var(--System-Gray-300)]"
                  : "text-[var(--green-dark)]"
              }`}
            >
              <span
                className={`font-semibold ${
                  isDark
                    ? "text-[var(--gray-lighter)]"
                    : "text-[var(--primary-light)]"
                }`}
              >
                Price
              </span>
              <span> ${userData.price} per Hour</span>
            </span>

            <div className="flex flex-row py-3 gap-6">
              <div className="flex flex-col justify-start items-start gap-2">
                <h2
                  className={`text-md font-semibold ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--teal-950)]"
                  }`}
                >
                  Available
                </h2>
                {userData.availabilites.filter((boo) => !boo.isBooked)
                  .length === 0 ? (
                  <span
                    className={`text-sm ${
                      isDark
                        ? "text-[var(--System-Gray-300)]"
                        : "text-[var(--green-dark)]"
                    }`}
                  >
                    No available times
                  </span>
                ) : (
                  userData.availabilites
                    .filter((boo) => !boo.isBooked)
                    .map((boo) => (
                      <label
                        className={`text-sm p-2 rounded-lg flex flex-col gap-2 ${
                          isDark
                            ? "bg-[var(--green-medium)] text-[var(--System-Gray-200)]"
                            : "bg-[var(--green-dark)] text-[var(--gray-lighter)]"
                        }`}
                      >
                        <span className="flex">
                          {day(boo.dayOfWeek)}, {FormateDate(boo.endTime)}
                        </span>
                        <span className="flex">
                          {time(boo.startTime, boo.endTime)}
                        </span>
                      </label>
                    ))
                )}
              </div>

              <div className="flex flex-col justify-start items-start gap-2">
                <h2
                  className={`text-md font-semibold ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--teal-950)]"
                  }`}
                >
                  Booked
                </h2>
                {userData.availabilites.filter((boo) => boo.isBooked).length ===
                0 ? (
                  <span
                    className={`text-sm ${
                      isDark
                        ? "text-[var(--System-Gray-300)]"
                        : "text-[var(--green-dark)]"
                    }`}
                  >
                    No booked times
                  </span>
                ) : (
                  userData.availabilites
                    .filter((boo) => boo.isBooked)
                    .map((boo) => (
                      <label
                        className={`text-sm ${
                          isDark
                            ? "text-[var(--System-Gray-300)]"
                            : "text-[var(--green-dark)]"
                        }`}
                      >
                        {day(boo.dayOfWeek)}, {FormateDate(boo.startTime)}
                        {time(boo.startTime, boo.endTime)}
                      </label>
                    ))
                )}
              </div>
            </div>

            {/* add availabilty */}
            <button
              className={`text-gray-900 cursor-pointer p-2 flex flex-row justify-center items-center gap-1 text-sm rounded-md ${
                isDark
                  ? "bg-[var(--gray-light)]"
                  : "bg-[var(--System-Gray-300)]"
              }`}
            >
              <MdOutlineAdd />
              Availabilty Time
            </button>
          </div>

          <hr
            className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
          ></hr>

          {/* Edit profile */}
          <div className="flex flex-row gap-3 justify-end items-center py-7 px-3">
            <button
              className={`text-end border-1 text-[var(--secondary-light)] py-2 px-3 rounded-md border-[var(--gray-medium)] ${
                isDark ? "bg-[var(--primary-dark)]" : "bg-[var(--primary)]"
              }`}
            >
              Edit Profile
            </button>
            <button
              className={`text-end border-1 text-[var(--secondary-light)] py-2 px-3 rounded-md ${
                isDark
                  ? "bg-[var(--primary-dark)] border-[var(--gray-medium)]"
                  : "bg-[var(--primary)]"
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
            const resp = await ChangePassword(changeData);
            console.log(resp.data);
          } catch (err: any) {
            console.log("error change password: ", err);
          }
        }}
      >
        <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
          <div className="flex flex-col">
            <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
              Current Password
            </label>
            <input
              value={changeData.currentPassword}
              onChange={(e) =>
                setChangeData({
                  ...changeData,
                  currentPassword: e.target.value,
                })
              }
              name="currentPassword"
              type="password"
              placeholder="**********"
              className={`flex w-full items-center text-[var(--primary)]`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
              New Password
            </label>
            <input
              onChange={(e) =>
                setChangeData({ ...changeData, NewPassword: e.target.value })
              }
              value={changeData.NewPassword}
              name="NewPassword"
              type="password"
              placeholder="**********"
              className={`flex w-full items-center text-[var(--primary)]`}
            />
          </div>
        </div>
      </ModalChangePassword>
    </>
  );
};

export default ProfMentor;
