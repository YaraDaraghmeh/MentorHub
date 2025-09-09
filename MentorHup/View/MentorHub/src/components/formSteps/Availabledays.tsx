import { useContext, useState } from "react";
import FormFiled from "../Form/FormFiled";
import { StepperContext } from "../../Context/StepperContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Available = () => {
  const { userData, setUserData } = useContext(StepperContext);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
      <h3 className="text-center justify-center text-[var(--primary)] text-base font-medium">
        Availability
      </h3>

      {/* inputs */}
      <FormFiled
        onChange={handleChange}
        value={userData["startDate"] || ""}
        type="date"
        label=""
        name="startDate"
        placeholder="1/11/2025"
      />
      <FormFiled
        onChange={handleChange}
        value={userData["endDate"] || ""}
        type="date"
        label=""
        name="endDate"
        placeholder="12/12/2025"
      />
      <div className="w-full">
        <input
          onClick={() => setShowCalendar(!showCalendar)}
          onChange={handleChange}
          value={userData["startDate"] || ""}
          name="startDate"
          placeholder="1/11/2025"
          type="text"
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Calender */}

        {showCalendar && (
          <DayPicker
            mode="single"
            selected={userData["startDate"] || ""}
            onSelect={() => {
              userData["startDate"] || "";
              setShowCalendar(false);
            }}
            className="mt-2 "
          />
        )}
      </div>
    </div>
  );
};

export default Available;
