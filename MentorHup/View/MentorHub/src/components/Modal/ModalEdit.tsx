import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";
import { useEffect, useState } from "react";
import Alert from "../Tables/alerts";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";

interface skill {
  id: number;
  name: string;
}

interface dataModal {
  open: boolean;
  value: skill;
  onClose: () => void;
  onConfirm: (updated: skill) => void;
}

export default function ModalEdit({
  open,
  value,
  onClose,
  onConfirm,
}: dataModal) {
  const { isDark } = useTheme();
  const [skillname, setSkillname] = useState(value.name);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    setSkillname(value.name);
    console.log(value.id);
  }, [value]);

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setErrorMessage(true);
      return;
    }

    try {
      const resp = await axios.put(
        `${urlSkills.SKILLS}/${value.id}`,
        { skillName: skillname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.status === 200) {
        onConfirm({ id: value.id, name: skillname });
        onClose();
        setSuccessMessage(true);
      }
    } catch (error: any) {
      setErrorMessage(true);
      console.log(error);
    }
  };

  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="" onClose={onClose}>
          {/* background */}
          <div className="fixed inset-0 bg-black/50 z-68" />

          {/* content */}
          <div className="fixed inset-0 z-70 flex items-center justify-center">
            <div
              className={`p-7 flex flex-col gap-3 w-[32%] rounded ${
                isDark ? "bg-[var(--primary-light)]" : "bg-white"
              }`}
            >
              <Dialog.Title
                className={`text-md text-center flex flex-col gap-2 font-semibold ${
                  isDark
                    ? "text-[var(--secondary-light)]"
                    : "text-[var(--primary-light)]"
                }`}
              >
                Edit Skill Name
              </Dialog.Title>
              <div className="flex flex-col gap-3">
                <label
                  className={`flex ${
                    isDark
                      ? "text-[var(--secondary-light)]"
                      : "text-[var(--primary-light)]"
                  }`}
                >
                  Skill Name:
                </label>
                <input
                  className={`flex w-full font-medium text-sm rounded-sm border-2 placeholder-gray-400 border-[var(--System-Gray-300)] px-3 py-2 text-[var(--primary)] ${
                    isDark ? "bg-white" : "bg-[var(--secondary-light)]"
                  }`}
                  type="text"
                  name="name"
                  placeholder="QA, React JS, ..."
                  value={skillname}
                  onChange={(e) => setSkillname(e.target.value)}
                  required
                />
              </div>
              <div className="pt-4 flex justify-between ">
                <button
                  className={`px-2.5 py-2 border border-[#36414f] text-sm rounded-[8px] tracking-wider ${
                    isDark
                      ? "bg-[#36414f] text-white"
                      : "bg-white text-[var(--primary)]"
                  } `}
                  onClick={onClose}
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
      {/* alert error */}
      {errorMessage && (
        <Alert open={errorMessage} type="error" message="Not Authorized!" />
      )}

      {/* alert success */}
      {successMessage && (
        <Alert
          open={successMessage}
          type="success"
          message="Skill updated successfully!"
        />
      )}
    </>
  );
}
