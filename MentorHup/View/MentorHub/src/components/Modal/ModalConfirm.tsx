import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";

interface dataModal {
  open: boolean;
  message: string;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  open,
  message,
  title,
  onClose,
  onConfirm,
}: dataModal) {
  const { isDark } = useTheme();

  return (
    <Transition show={open} as={Fragment}>
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
              className={`text-lg font-semibold ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {title}
            </Dialog.Title>
            <Dialog.Description
              className={`mt-2 text-sm tracking-wider ${
                isDark
                  ? "text-[var(--System-Gray-300)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {message}
            </Dialog.Description>
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
                OK
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
