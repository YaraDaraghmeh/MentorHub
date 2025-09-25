import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";
import Alert from "../Tables/alerts";

interface AvailabilityModalProps {
  onSubmit: (data: { startTime: string; endTime: string }) => void;
  onclose: () => void;
  open?: boolean;
}

export const AvailabilityModal = ({
  onSubmit,
  onclose,
  open,
}: AvailabilityModalProps) => {
  const { isDark } = useTheme();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [warning, setWarning] = useState({ message: "", show: false });

  const handleSave = () => {
    if (!date || !startTime || !endTime) {
      setWarning({ message: "Please fill in all fields", show: true });
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setWarning({ message: "Invalid date or time", show: true });
      return;
    }

    if (start >= end) {
      setWarning({ message: "End time must be after start time.", show: true });
    }

    const payload = {
      startTime: start.toISOString(), // بيعطيك 2025-09-25T11:50:46.680Z
      endTime: end.toISOString(),
    };

    console.log("payload sent", payload);
    onSubmit(payload);

    onclose();
    setWarning({ message: "", show: false });
  };

  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="" onClose={onclose}>
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
                Set Availability
              </Dialog.Title>
              <div className="flex flex-col gap-4">
                <label
                  className={`text-start justify-center text-base font-medium ${
                    isDark ? "text-gray-200" : "text-[var(--primary)]"
                  }`}
                >
                  Date
                </label>
                <input
                  className={`flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 w-full border-1 border-[var(--System-Gray-300)] }`}
                  type="date"
                  placeholder="2025-09-25"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    backgroundColor: "oklch(96.7% 0.003 264.542)",
                    color: "var(--primary)",
                  }}
                />
                <div className="flex flex-row gap-3">
                  <div className="flex flex-col w-full gap-2">
                    <label
                      className={`text-start justify-center text-base font-medium ${
                        isDark ? "text-gray-200" : "text-[var(--primary)]"
                      }`}
                    >
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={`flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 w-full border-1 bg-gray-100 border-[var(--System-Gray-300)] }`}
                    />
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <label
                      className={`text-start justify-center text-base font-medium ${
                        isDark ? "text-gray-200" : "text-[var(--primary)]"
                      }`}
                    >
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={`flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 w-full border-1 bg-gray-100 border-[var(--System-Gray-300)] }`}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-7 flex justify-between ">
                <button
                  className={`px-2.5 py-2 border border-[#36414f] text-sm rounded-[8px] tracking-wider ${
                    isDark
                      ? "bg-[#36414f] text-white"
                      : "bg-white text-[var(--primary)]"
                  } `}
                  onClick={onclose}
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

      {/* alert warning */}
      <Alert type="warning" open={warning.show} message={warning.message} />
    </>
  );
};
