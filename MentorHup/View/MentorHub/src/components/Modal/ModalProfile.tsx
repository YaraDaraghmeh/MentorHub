import { useEffect, useState } from "react";
import profile from "../../assets/avatar-profile.png";
import { useTheme } from "../../Context/ThemeContext";
import bg from "../../assets/bg-profile-shape.png";
import { RxDotFilled } from "react-icons/rx";
import axios from "axios";
import type { Mentor } from "../../types/types";
import StarReview from "../Stars/StarReview";

interface propsProfile {
  isOpen: boolean;
  mentor: Mentor;
  onClose: () => void;
}

const ModalProfile = ({ isOpen, mentor, onClose }: propsProfile) => {
  const { isDark } = useTheme();

  console.log("user: ", mentor);
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.log("Not Authorized");
  }

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`flex-col fixed top-3 bottom-3 z-100 w-60 lg:w-[600px] h-auto shadow-2xl rounded w-full max-h-[95vh] overflow-y-auto ${
          isDark ? "shadow-[#7e827e] bg-[var(--primary)]" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors ${
            isDark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

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
              {/* <span
                className={`py-1 px-4 mx-2 rounded-full flex flex-col justify-center items-center border-1 ${
                  isDark
                    ? "border-gray-600 text-[var(--primary)] bg-[var(--Philippine)]"
                    : "border-gray-400 text-[var(--secondary-light)] bg-[var(--primary)]"
                }`}
              > */}
              <StarReview rating={mentor.reviewCount} />
              {/* </span> */}
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
                  {mentor.name}
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
                  isDark ? "text-gray-400" : "text-[var(--gray-medium)]"
                }`}
              >
                {mentor.email}
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
                  <span className="flex">{mentor.field} </span>
                  <span className="flex text-gray-400"> at </span>
                  <span className="flex text-gray-600">
                    {mentor.companyName}
                  </span>
                </h3>
              </div>
            </div>

            {/* description */}
            <div className="flex lg:flex-row md:flex-col p-2 justify-between items-start">
              <div className="flex flex-col">
                <p
                  className={`lg:w-140 md:w-80  text-start ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--primary)]"
                  }`}
                >
                  {mentor.description}
                </p>
              </div>
            </div>
            {/* </div>  */}

            <hr
              className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
            ></hr>

            <div className="flex flex-col w-full justify-start items-start py-5 px-2 gap-3">
              <h2
                className={`text-lg font-semibold ${
                  isDark
                    ? "text-[var(--secondary-light)]"
                    : "text-[var(--primary-light)]"
                }`}
              >
                Skills
              </h2>
              <div className="flex lg:flex-row md:flex-col">
                {mentor.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm m-2 ${
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

            {/* <div className="flex flex-col justify-start items-start py-5 px-2 gap-3">
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
                <span className="flex flex-row gap-2">
                  <label htmlFor="cvUp" className="cursor-pointer">
                    Change CV
                  </label>
                </span>
              ) : (
                <label htmlFor="cvUp" className="cursor-pointer">
                  Do you want upload CV?
                </label>
              )}
              <input
                id="cvUp"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx" // Added accept attribute
              />
            </span>
          </div> */}

            <hr
              className={`${isDark ? "text-[#383e4085]" : "text-[#8e999d85]"}`}
            ></hr>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProfile;
