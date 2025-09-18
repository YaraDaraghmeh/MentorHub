import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";
import type { skills } from "../Tables/interfaces";
import Alert from "../Tables/alerts";

interface dataModal {
  open: boolean;
  table: React.ReactNode;
  onClose: () => void;
  // onSave?: (skill: skills) => void;
}

export default function ModalSkills({
  open,
  table,
  onClose,
}: // onSave,
dataModal) {
  const { isDark } = useTheme();
  const [show, setShow] = useState(false);
  const [inputData, setInputData] = useState({ skillName: "" });
  const [message, setMessage] = useState(false);
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const [messageError, setMessageError] = useState(false);

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
        setMessage(true);
      } else {
        const res = await axios.post(urlSkills.ADD_SKILLS, inputData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log(res.data);

        if (res.status == (201 | 200)) {
          setInputData({ skillName: "" });
          // onSave?.(res.data);
          setShow(false);
          setShowMessageSuccess(true);
        }
      }
    } catch (error: any) {
      setMessageError(true);
      console.error(error.response?.data || error.message);
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
          <Alert
            type="warning"
            message="Skill name is required"
            open={message}
            onClose={() => setMessage(false)}
          />

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
      {/* alert error message */}
      <Alert
        type="error"
        message="Error adding skill!"
        open={messageError}
        onClose={() => setMessageError(false)}
      />
      {/* alert success message */}
      <Alert
        type="success"
        message="The skill has been successfully added!"
        open={showMessageSuccess}
        onClose={() => setShowMessageSuccess(false)}
      />
      ;
    </>
  );
}
