import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";

interface dataModal {
  open?: boolean;
  message: string;
  title: string;
  onConfirm: () => void;
}

export default function ModalOk({
  open,
  message,
  title,
  onConfirm,
}: dataModal) {
  const { isDark } = useTheme();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" onClose={() => false}>
        {/* background */}
        <div className="fixed z-54 inset-0 bg-black/50" />

        {/* content */}
        <div className="fixed z-55 inset-0 flex items-center justify-center">
          <div
            className={`p-7 rounded w-[20rem] ${
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
            <div className="pt-7 flex justify-center ">
              <button
                className={`px-3 py-2 font-semibold rounded-[8px] text-sm bg-[#fb2c36] text-white`}
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
