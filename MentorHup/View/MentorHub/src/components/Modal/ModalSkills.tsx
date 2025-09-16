import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";

interface dataModal {
  open: boolean;
  table: React.ReactNode;
  onClose: () => void;
}

export default function ModalSkills({ open, table, onClose }: dataModal) {
  const { isDark } = useTheme();
  const [show, setShow] = useState(false);
  const [inputData, setInputData] = useState({ skillName: "" });

  const handleAddSkills = () => {
    setShow(true);
  };

  const handlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((pr) => ({ ...pr, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = axios.post(urlSkills.ADD_SKILLS, inputData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Modal skills */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={onClose}>
          {/* background */}
          <div className="fixed right-0 inset-0 bg-black/50 " />

          {/* content */}
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              className={`p-7 rounded ${
                isDark ? "bg-[var(--primary-light)]" : "bg-white"
              }`}
            >
              <div className="flex">
                <button onClick={handleAddSkills}>
                  <RiAddLine />
                  Add Skills
                </button>
              </div>

              {/* table */}
              <div>{table}</div>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal add skills */}
      <Transition show={show} as={Fragment}>
        <Dialog as="div" className="relative z-30 " onClose={onClose}>
          {/* background */}
          <div className="fixed inset-0 bg-black/50 " />

          {/* content */}
          <div className="fixed inset-0 flex items-center justify-center">
            <div
              className={`p-7 rounded ${
                isDark ? "bg-[var(--primary-light)]" : "bg-white"
              }`}
            >
              <Dialog.Title
                className={`text-md font-semibold ${
                  isDark
                    ? "text-[var(--secondary-light)]"
                    : "text-[var(--primary-light)]"
                }`}
              >
                <label className="flex-col">Skill Name:</label>
                <input
                  className="flex-col w-full"
                  type="text"
                  name="skillName"
                  placeholder="QA, React JS, ..."
                  value={inputData.skillName}
                  onChange={handlChange}
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
    </>
  );
}
