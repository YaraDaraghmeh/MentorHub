import { useContext } from "react";
import FormFiled from "../Form/FormFiled";
import { StepperContext } from "../../Context/StepperContext";
import { FaChevronDown } from "react-icons/fa6";

const PriceandSkills = () => {
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
        value={userData["price"] || ""}
        type="number"
        label="Price Booking"
        name="price"
        placeholder="0 $"
      />

      <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
        Skills
      </label>

      <div className="relative flex w-full">
        <select
          id="skills"
          onChange={handleChange}
          className="appearance-none w-full p-2 pr-10 text-md text-[var(--primary)] bg-gray-50 border rounded-md
        focus:ring-2 focus:ring-blue-400 focus:border-blue-4"
        >
          <option selected>Choose a skills</option>
          <option value={userData["QA"] || ""}>QA</option>
          <option value="CA">Canada</option>
          <option value="DE">Germany</option>
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default PriceandSkills;
