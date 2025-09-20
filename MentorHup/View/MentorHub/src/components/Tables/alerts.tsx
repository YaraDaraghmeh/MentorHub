import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { AiOutlineWarning, AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { CloseButton } from "@headlessui/react";

interface AlertProps {
  type: "success" | "warning" | "error";
  message: string;
  open: boolean;
  onClose?: () => void;
  autoClose?: number;
}

export default function Alert({
  type,
  message,
  open,
  onClose,
  autoClose = 5000,
}: AlertProps) {
  const [show, setShow] = useState(open);
  let bgColor = "";
  let textColor = "";
  let Icon = null;
  let dark = "";
  let span = "";

  switch (type) {
    case "success":
      bgColor = "bg-green-50";
      textColor = "text-green-800";
      dark = "dark:bg-gray-800 dark:text-green-400";
      Icon = <IoCheckmarkDoneCircle className="w-5 h-5 mr-2" />;
      span =
        "bg-green-50 focus:ring-2 focus:ring-blue-300 p-1.5 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700";
      break;
    case "warning":
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-800";
      dark = "dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800";
      Icon = <AiOutlineWarning className="w-5 h-5 mr-2" />;
      span =
        "bg-yellow-50 focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700";
      break;
    case "error":
      bgColor = "bg-red-50";
      textColor = "text-red-800";
      Icon = <AiOutlineCloseCircle className="w-5 h-5 mr-2" />;
      break;
  }

  useEffect(() => {
    setShow(open);

    if (open && autoClose > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose && onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-3 left-[40%] z-70 flex items-center shadow-sm p-4 mb-4 text-sm rounded-lg ${bgColor} ${textColor} ${dark}`}
      role="alert"
    >
      {Icon}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          aria-label="Close"
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className={`ms-auto -mx-1.5 -my-1.5 ml-2 font-bold rounded-lg inline-flex items-center justify-center h-8 w-8 ${span}`}
        >
          <CloseButton className={`sr-only w-3 h-3 ${textColor}`} />
        </button>
      )}
    </div>
  );
}
