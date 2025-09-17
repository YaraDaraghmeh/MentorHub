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
        value={userData["startTime"] || ""}
        type="datetime-local"
        label="Start Time"
        name="startTime"
        placeholder=""
      />
      <FormFiled
        onChange={handleChange}
        value={userData["endTime"] || ""}
        type="datetime-local"
        label="End Time"
        name="endTime"
        placeholder=""
      />
    </div>
  );
};

export default Available;
