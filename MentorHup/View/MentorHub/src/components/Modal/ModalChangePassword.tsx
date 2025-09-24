import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";

interface dataModal {
  open?: boolean;
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalChangePassword({
  open,
  children,
  title,
  onClose,
  onConfirm,
}: dataModal) {
  const { isDark } = useTheme();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="" onClose={onClose}>
        {/* background */}
        <div className="fixed z-54 inset-0 bg-black/50" />

        {/* content */}
        <div className="fixed z-55 inset-0 flex items-center justify-center">
          <div
            className={`p-7 rounded w-[35rem] ${
              isDark ? "bg-[var(--primary-light)]" : "bg-white"
            }`}
          >
            <Dialog.Title
              className={`text-lg font-semibold ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {title}
            </Dialog.Title>
            <div className="flex flex-col">{children}</div>
            <div className="pt-7 flex justify-between ">
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
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
