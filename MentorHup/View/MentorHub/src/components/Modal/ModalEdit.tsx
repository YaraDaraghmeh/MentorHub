import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";

interface skill {
  id: number;
  skillName: string;
}

interface dataModal {
  open: boolean;
  value: skill;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalEdit({
  open,
  value,
  onClose,
  onConfirm,
}: dataModal) {
  const { isDark } = useTheme();

  console.log(value.skillName);

  return (
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
                name="skillName"
                placeholder="QA, React JS, ..."
                value={value.skillName}
                // onChange={handlChange}
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
                onClick={onConfirm}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
