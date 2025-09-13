import { useContext } from "react";
import FormFiled from "../Form/FormFiled";
import { StepperContext } from "../../Context/StepperContext";

const ProfileInfo = () => {
  const { userData, setUserData } = useContext(StepperContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
      {/* inputs */}
      <FormFiled
        onChange={handleChange}
        value={userData["experience"] || ""}
        type="number"
        label="Experience"
        name="experience"
        placeholder="Experience Year"
      />
      <FormFiled
        onChange={handleChange}
        value={userData["field"] || ""}
        type="text"
        label="Field"
        name="field"
        placeholder="QA, UI/UX..."
      />
      <FormFiled
        onChange={handleChange}
        value={userData["description"] || ""}
        type="text"
        label="Description"
        name="description"
        placeholder="I'm.."
      />
    </div>
  );
};

export default ProfileInfo;
