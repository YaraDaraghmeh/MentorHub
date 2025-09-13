import { useContext } from "react";
import FormFiled from "../Form/FormFiled";
import { StepperContext } from "../../Context/StepperContext";

const Available = () => {
  const { userData, setUserData } = useContext(StepperContext);

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
        label="Start Date"
        name="startDate"
        placeholder="1/11/2025"
      />
      <FormFiled
        onChange={handleChange}
        value={userData["endDate"] || ""}
        type="date"
        label="End Date"
        name="endDate"
        placeholder="12/12/2025"
      />
      <FormFiled
        onChange={handleChange}
        value={userData["duration"] || ""}
        type="text"
        label="Duration"
        name="duration"
        placeholder="60 min"
      />
    </div>
  );
};

export default Available;
