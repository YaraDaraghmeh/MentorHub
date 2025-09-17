import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

interface dataModal {
  open: boolean;
  table: React.ReactNode;
  onClose: () => void;
}

export default function ModalSkills({ open, table, onClose }: dataModal) {
  const { isDark } = useTheme();
  const [show, setShow] = useState(false);
  const [inputData, setInputData] = useState({ skillName: "" });
  const [message, setMessage] = useState("");
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);

  const handlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((pr) => ({ ...pr, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken")?.trim();
    if (!token) {
      console.log("Not Authorized");
      return;
    }

    try {
      // if input null
      if (!inputData.skillName.trim()) {
        setMessage("Skill name is required");
      } else {
        const res = await axios.post(urlSkills.ADD_SKILLS, inputData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Skill added:", res);
        setInputData({ skillName: "" });
        setShow(false);
        setMessage("");

        setShowMessageSuccess(true);
      }
    } catch (error: any) {
      console.error(
        "Error adding skill:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      {/* Modal skills */}
      {open && (
        <div
          className={`flex-col left-full top-0 w-48 lg:w-[550px] min-h-screen p-3 shadow-2xl p-6 rounded w-full ${
            isDark ? "shadow-[#7e827e] bg-[var(--primary)]" : "bg-white"
          }`}
        >
          {/* content */}
          <div className="mb-3">
            <div className="flex flex-col items-start h-full gap-4">
              <button
                className={`flex text-[var(--secondary-light)] text-medium justify-center items-center px-2 py-1.5 rounded-xl ${
                  isDark ? "bg-[var(--gray-dark)]" : "bg-[var(--primary)]"
                }`}
                onClick={() => setShow(true)}
              >
                <RiAddLine />
                <span>Add Skills</span>
              </button>

              {/* table skills */}
              <div className="flex">{table}</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal add skills */}
      <Transition show={show} as={Fragment}>
        <Dialog as="div" className="relative z-60 " onClose={onClose}>
          {/* background */}
          <div className="fixed inset-0 bg-black/50 " />

          {/* alert warning message */}
          {message && (
            <div
              className="flex fixed top-0 left-[40%] z-70 items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
              role="alert"
            >
              <svg
                className="shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Warning !</span> {message}
              </div>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                data-dismiss-target="#alert-1"
                aria-label="Close"
                onClick={() => setMessage("")}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          )}
          {/* content */}
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              className={`p-7 rounded w-[32%] ${
                isDark ? "bg-[var(--primary-light)]" : "bg-white"
              }`}
            >
              <Dialog.Title
                className={`text-md text-start flex flex-col gap-2 font-semibold ${
                  isDark
                    ? "text-[var(--secondary-light)]"
                    : "text-[var(--primary-light)]"
                }`}
              >
                <label className="flex">Skill Name:</label>
                <input
                  className={`flex w-full font-medium text-sm rounded-sm border-2 placeholder-gray-400 border-[var(--System-Gray-300)] px-3 py-2 text-[var(--primary)] ${
                    isDark ? "bg-white" : "bg-[var(--secondary-light)]"
                  }`}
                  type="text"
                  name="skillName"
                  placeholder="QA, React JS, ..."
                  value={inputData.skillName}
                  onChange={handlChange}
                  required
                />
              </Dialog.Title>
              <div className="pt-7 flex justify-between ">
                <button
                  className={`px-2.5 py-2 border border-[#36414f] text-sm rounded-[8px] tracking-wider ${
                    isDark
                      ? "bg-[#36414f] text-white"
                      : "bg-white text-[var(--primary)]"
                  } `}
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-2.5 py-2 font-semibold rounded-[8px] text-sm bg-[#fb2c36] text-white`}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* alert message */}
      {showMessageSuccess && (
        <div
          className=" fixed top-3 left-[40%] z-70 flex items-center shadow-sm p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <IoCheckmarkDoneCircle className="w-4 h-4" />
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Success !</span> The skill has been
            successfully added
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-green-50 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-1"
            aria-label="Close"
            onClick={() => setShowMessageSuccess(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
